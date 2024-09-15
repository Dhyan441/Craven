// src/App.js
import React, { useState, useEffect } from 'react';
const path = require("path");



const getImageCount = async (folder) => {
  try {
    const response = await fetch(`/images/${folder}/`); // Adjust based on your directory structure
    const text = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, 'text/html');
    const imageElements = htmlDoc.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]');
    return imageElements.length;
  } catch (error) {
    console.error(`Error fetching image count for folder ${folder}:`, error);
    return 0;
  }
};

function App() {
  const [counts, setCounts] = useState({ dhyan: 0, nandan: 0, abhinav: 0, sumedh: 0 });

  const updateCounts = async () => {
    const folders = ['dhyan', 'nandan', 'abhinav', 'sumedh'];
    const newCounts = {};
    for (const folder of folders) {
      newCounts[folder] = await getImageCount(folder);
    }
    setCounts(newCounts);
  };

  useEffect(() => {
    updateCounts(); // Initial fetch

    const intervalId = setInterval(updateCounts, 20 * 60 * 1000); // Update every 20 minutes

    return () => clearInterval(intervalId); // Clean up the interval on component unmount
  }, []);

  return (
    <div>
      <h1>Craven</h1>
      <ul>
        <li>Dhyan: {counts.dhyan} times</li>
        <li>Nandan: {counts.nandan} times</li>
        <li>Abhinav: {counts.abhinav} times</li>
        <li>Sumedh: {counts.sumedh} times</li>
      </ul>
      
      <h2>Live Stream</h2>
      <iframe 
        allowFullScreen 
        webkitallowfullscreen 
        mozallowfullscreen 
        src="https://video.nest.com/embedded/live/qVvjeRRcLs?autoplay=0" 
        frameBorder="0" 
        width="720" 
        height="576" 
        title="Live Stream"
      ></iframe>
    </div>
  );
}

export default App;
