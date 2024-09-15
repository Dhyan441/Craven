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

// Spawn a new process to run the Python script
const pythonProcess = spawn('python', ['../scripts/recognize.py']);
name = "temp"
// Listen to data event to receive output from the Python script
pythonProcess.stdout.on('data', (data) => {
    name = data
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
return name

}

const generateMeme = (name, event_id) => {
    // Spawn a new process to run the Python script
    const pythonProcess = spawn('python', ['../scripts/memeify.py', `${name}-${event_id}`]);

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

const fs = require('fs');
const path = require('path');
const config = require('./config');

const tweet = (name, event_id) => {
    const apiClient = config.newClient();
    const uploadClient = config.newClient('upload');

    const mediaFile = fs.readFileSync(path.join(__dirname, 'hello_world.png'));
    const base64image = uffer.from(mediaFile).toString('base64');

    uploadClient.post('media/upload', { media_data: base64image })
    .then(media => {

    console.log('You successfully uploaded media');

    var media_id = media.media_id_string;
    apiClient.post('statuses/update', { status: 'Hello world!', media_ids: media_id })
        .then(tweet => {

        console.log('Your image tweet is posted successfully');
    }).catch(console.error);

}).catch(console.error);
}

nest.init().then(() => {
    nest.subscribe((event) => {
       console.log(event)
       if (event) {    
            takeImage(event.id)
            name = recognizeFace(event.id)

            if (name !== "temp"){
                decision = callVoiceFlow(event.id)
                if(decision === "twitter" || true){ //UNCOMMENT LATER
                    generateMeme(name, event.id)
                    tweet(name, event.id)
                } else if(decision === "text"){
                    textCulprit(name)
                }
            }
            
        }
    });
});
