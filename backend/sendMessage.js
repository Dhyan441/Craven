const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TwilioSID;
const authToken = process.env.TwilioToken;

// Initialize the Twilio client
const client = new twilio(accountSid, authToken);

client.messages.create({

    body: 'YOOOO IT SENDS',
    from: '+13302398653',
    to: '+17803815182'       
})
.then(message => console.log('Message sent with SID:', message.sid))
.catch(error => console.error('Error sending message:', error));
