const express = require('express');
const twilio = require('twilio');
const fs = require("dotenv").config();

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
  function countJpgsInFolders(folders) {
    const counts = {};
    
    folders.forEach(folder => {
      const folderPath = path.join(__dirname, 'images', folder);
      if (fs.existsSync(folderPath)) {
        counts[folder] = countJpgFiles(folderPath);
      } else {
        counts[folder] = 0;
        console.log(`Folder ${folder} does not exist.`);
      }
    });
  
    return counts;
  }


// Endpoint to get .jpg file counts in specified folders
app.get('/stats', (req, res) => {
    // Expecting a query parameter with a list of folder names
    const folders = req.query.folders ? req.query.folders.split(',') : [];
  
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




