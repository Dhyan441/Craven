const express = require('express');
const twilio = require('twilio');
const fs = require('fs');
const path = require("path");

require("dotenv").config();

const accountSid = process.env.TwilioSID;
const authToken = process.env.TwilioToken; 

const client = twilio(accountSid, authToken);

const app = express();
app.use(express.urlencoded({ extended: false }));

// Route to handle incoming messages
app.post('/sms', (req, res) => {
    console.log('Received a POST request');
    console.log(req.body);

    const messageBody = req.body.Body;
    const senderNumber = req.body.From;

    console.log(`Received message "${messageBody}" from ${senderNumber}`);

    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Thank you for your message!');

    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

function countJpgFiles(dirPath) {
    const files = fs.readdirSync(dirPath);
    return files.filter(file => path.extname(file).toLowerCase() === '.jpg').length;
  }
  
  // Function to count jpg files in all specified folders
  function countJpgsInFolders(roommates) {
    const counts = {};

    roommates.forEach(roommate => {
        let path = '../nest-collect/images/' + roommate

        console.log(path)
      if (fs.existsSync(path)) {
        counts[roommate] = countJpgFiles(path);
      } else {
        counts[roommate] = 0;
        console.log(`Folder ${path} does not exist.`);
      }
    });
  
    return counts;
  }


// Endpoint to get .jpg file counts in specified folders
app.get('/stats', (req, res) => {
    // Expecting a query parameter with a list of folder names
    const folders = ['abhinav', 'dhyan', 'sumedh', 'nandan'];
    if (!folders.length) {
      return res.status(400).json({ error: 'No folders specified.' });
    }
  
    const counts = countJpgsInFolders(folders);
    res.json(counts);
  });

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});




