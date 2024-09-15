const Nest = require('nest-cam');
const fs = require('fs')
const path = require('path');
const { spawn } = require('child_process');
require('dotenv').config();

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

const recognizeFace = (id) => {
    // index.js


// Spawn a new process to run the Python script
const pythonProcess = spawn('python', ['../scripts/recognize.py']);

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
    console.log(`Python script exited with code ${code}`);
});

}

nest.init().then(() => {
    nest.subscribe((event) => {
       console.log(event)
       if (event) {    
            takeImage(event.id)
            recognizeFace(event.id)
        }
    });
});
