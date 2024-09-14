const Nest = require('nest-cam');
const fs = require('fs')
require('dotenv').config();

const nest = new Nest({
    nestId: process.env.NEST_ID,
    refreshToken: process.env.REFRESH_TOKEN,
    apiKey: process.env.X_GOOG_API_KEY,
    clientId: process.env.CLIENT_ID,
    eventInterval: "1000"
});

nest.init().then(() => {
    nest.getLatestSnapshot().then((data) => {
        console.log('Found the latest snapshot!');
        data.pipe(fs.createWriteStream('image_3.jpg'));
    }).catch(err => console.log(err))
});