const Nest = require('nest-cam');
const fs = require('fs')
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();
const twilio = require('twilio');
require('dotenv').config();

const accountSid = process.env.TwilioSID;
const authToken = process.env.TwilioToken;

// Initialize the Twilio client
const client = new twilio(accountSid, authToken);


const nest = new Nest({
    nestId: process.env.NEST_ID,
    refreshToken: process.env.REFRESH_TOKEN,
    apiKey: process.env.X_GOOG_API_KEY,
    clientId: process.env.CLIENT_ID,
    eventInterval: 300,
    snapshotInterval: 300
});

const dirPath = path.join(__dirname, 'images', 'temp');
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

const takeImage = (id) => {
    console.log("called on " + id)
    nest.getLatestSnapshot().then((image) => {
        // Write the file
        image.pipe(fs.createWriteStream(path.join(dirPath, `${id}.jpg`)));
    });

    console.log("written")
};

const alertUser = (name) => {
    client.messages.create({

        body: `ALERT: ${name} has tried to reach for your snacks but don't worry, I got your back. Check X in a couple minutes...`,
        from: '+13302398653',
        to: '+17803815182'       
    })
    .then(message => console.log('Message sent with SID:', message.sid))
    .catch(error => console.error('Error sending message:', error));
}

const recognizeFace = () => {
    return new Promise((resolve, reject) => {
        // Spawn a new process to run the Python script
        const pythonProcess = spawn('python', ['../scripts/recognize.py']);
        let name = "temp";

        // Listen to data event to receive output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            name = data.toString().trim(); // Convert buffer to string and remove extra spaces/newlines
            console.log(`Output from Python: ${name}`);
        });

        // Handle errors if the Python script fails to run
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        // Handle script exit
        pythonProcess.on('close', (code) => {
            console.log(`Python script recognizeFace exited with code ${code}`);
            resolve(name); // Resolve the promise with the name
        });
    });
}



const generateMeme = (name, event_id) => {
    return new Promise((resolve, reject) => {
        // Spawn a new process to run the Python script
        const pythonProcess = spawn('python', ['../scripts/memeify.py', name, `${name}-${event_id}.jpg`]);

        // Listen to data event to receive output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Output from Python: ${data}`);
        });

        // Handle errors if the Python script fails to run
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        // Handle script exit
        pythonProcess.on('close', (code) => {
            console.log(`Python script generateMeme exited with code ${code}`);
            if (code === 0) {
                resolve(); // Resolve if script exits successfully
            } else {
                reject(new Error(`Python script generateMeme exited with code ${code}`)); // Reject on error
            }
        });
    });
}

const tweet = (name, event_id) => {
    return new Promise((resolve, reject) => {
        // Spawn a new process to run the Python script
        const pythonProcess = spawn('python', ['../scripts/twitterScript.py', name, `${name}-${event_id}.jpg`, `DJ keeps stealing my food :(`]);

        // Listen to data event to receive output from the Python script
        pythonProcess.stdout.on('data', (data) => {
            console.log(`Output from Python: ${data}`);
        });

        // Handle errors if the Python script fails to run
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error: ${data}`);
        });

        // Handle script exit
        pythonProcess.on('close', (code) => {
            console.log(`Python script tweet exited with code ${code}`);
            if (code === 0) {
                resolve(); // Resolve if script exits successfully
            } else {
                reject(new Error(`Python script tweet exited with code ${code}`)); // Reject on error
            }
        });
    });
};

nest.init().then(() => {
    nest.subscribe(async (event) => {
        console.log(event);
        if (event) {
            takeImage(event.id);
            try {
                const name = await recognizeFace();
                console.log("LOLOLLO");
                if (name !== "temp") {
                    try {          
                        await generateMeme(name, event.id);
                        console.log("Meme generated, now tweeting..."); // Debugging log
                        await tweet(name, event.id); // Await tweet here
                        alertUser(name);

                    } catch (error) {
                        console.error(`Error in generating meme or tweeting: ${error}`);
                    }
                } else {
                    console.log("Recognized face as 'temp', skipping meme and tweet."); // Debugging log
                }
            } catch (error) {
                console.error(`Error recognizing face: ${error}`);
            }
        }
    });
});
