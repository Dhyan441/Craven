const fs = require('fs');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
require('dotenv').config();

// Twitter credentials
const BEARER_TOKEN = 'AAAAAAAAAAAAAAAAAAAAALiYvwEAAAAATB8HbRCTRukHD%2BuKpMOSdVzh7as%3DaOXCG3ZTOy779FK0abXBRAT0AAIFGtPLLr5Y0Eb1k95YbPlnLE';

// Path to your image
const imagePath = path.join(__dirname, 'abhi.jpg'); // Ensure correct path

// Upload image to Twitter
const uploadImageToTwitter = async () => {
  try {
    // Check if file exists
    if (!fs.existsSync(imagePath)) {
      throw new Error(`File not found: ${imagePath}`);
    }

    // Create form data
    const form = new FormData();
    form.append('media', fs.createReadStream(imagePath));
    form.append('media_category', 'tweet_image');

    // Post request to upload image
    const response = await axios.post('https://upload.twitter.com/1.1/media/upload.json', form, {
      headers: {
        ...form.getHeaders(),
        Authorization: `Bearer ${BEARER_TOKEN}`,
      },
    });

    console.log('Image uploaded successfully:', response.data);
  } catch (error) {
    console.error('Error uploading image:', error.response ? error.response.data : error.message);
  }
};

uploadImageToTwitter();
