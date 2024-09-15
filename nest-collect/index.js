const Nest = require('nest-cam');
const fs = require('fs')
const path = require('path');
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

nest.init().then(() => {
    nest.subscribe((event) => {
       console.log(event)
       if (event) {
       
            takeImage(event.id)
            setTimeout(() => takeImage(event.id+"v6008"), 300)
            setTimeout(() => takeImage(event.id+"1860093"), 600)
        }
    });
});
