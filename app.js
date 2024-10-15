// Select the button and output elements
const scanButton = document.getElementById('scan-button');
const output = document.getElementById('output');

// Function to start NFC scan
async function scanNFC() {
  try {
    // Check if the browser supports Web NFC
    if ('NDEFReader' in window) {
      const ndef = new NDEFReader();
      
      // Start NFC reading session
      await ndef.scan();
      
      output.innerHTML = 'Hold your device close to an NFC tag...';

      // Event listener for when an NFC message is read
      ndef.onreading = (event) => {
        const { serialNumber } = event;
        output.innerHTML = `NFC Tag Detected! <br> Serial Number: ${serialNumber}`;
        
        // Process each record
        for (const record of event.message.records) {
          switch (record.recordType) {
            case "text":
              const textDecoder = new TextDecoder();
              const text = textDecoder.decode(record.data);
              output.innerHTML += `<br> Text: ${text}`;
              break;
            case "url":
              const urlDecoder = new TextDecoder();
              const url = urlDecoder.decode(record.data);
              output.innerHTML += `<br> URL: <a href="${url}" target="_blank">${url}</a>`;
              break;
            default:
              output.innerHTML += `<br> Unknown record type: ${record.recordType}`;
          }
        }
      };

      ndef.onreadingerror = () => {
        output.innerHTML = 'Error reading NFC tag. Please try again.';
      };

    } else {
      output.innerHTML = "Web NFC API is not supported by this browser.";
    }
  } catch (error) {
    console.error('Error:', error);
    output.innerHTML = 'Something went wrong: ' + error;
  }
}

// Add click event listener to the button
scanButton.addEventListener('click', scanNFC);
