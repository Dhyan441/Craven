const Nest = require('nest-cam');
const fs = require('fs')
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
require('dotenv').config();

const nest = new Nest({
    nestId: process.env.NEST_ID,
    refreshToken: process.env.REFRESH_TOKEN,
    apiKey: process.env.X_GOOG_API_KEY,
    clientId: process.env.CLIENT_ID,
    eventInterval: 300,
    snapshotInterval: 300
});


const takeImage = (id) => {
    console.log("called on " + id)
    nest.getLatestSnapshot().then((image) => {
        // Save the image to disk with the event ID as the filename
        image.pipe(fs.createWriteStream(`abhinav-${id}.jpg`));
    });

    console.log("written")
};

nest.init().then(() => {
    nest.subscribe((event) => {
       console.log(event)
       if (event) {
       
            takeImage(event.id)
            setTimeout(() => takeImage(event.id+"v2"), 300)
            setTimeout(() => takeImage(event.id+"v3"), 600)
        }
    });
});
