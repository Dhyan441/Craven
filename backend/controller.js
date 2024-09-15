const express = require('express');
const twilio = require('twilio');
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

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});