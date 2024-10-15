async function scanNFC() {
  try {
    if ('NDEFReader' in window) {
      const ndef = new NDEFReader();
      await ndef.scan();

      document.getElementById('status').innerText = 'Hold your device close to an NFC tag...';

      ndef.onreading = (event) => {
        const { serialNumber } = event;
        const data = {
          serialNumber: serialNumber,
          text: null
        };

        for (const record of event.message.records) {
          if (record.recordType === "text") {
            const textDecoder = new TextDecoder();
            data.text = textDecoder.decode(record.data);
          }
        }

        sendDataToPowerAutomate(data);
      };
    } else {
      alert('Web NFC API not supported in this browser.');
    }
  } catch (error) {
    console.error('NFC scan error:', error);
  }
}

async function sendDataToPowerAutomate(data) {
  const url = 'https://prod-xyz.powerautomate.com/...'; // Replace with your Power Automate Flow URL
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      console.log('Data sent to Power Automate successfully');
    } else {
      console.error('Error sending data to Power Automate:', response.status);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

// Automatically start scanning NFC when the page loads
scanNFC();
