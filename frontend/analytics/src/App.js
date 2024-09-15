// src/App.js
import React, { useState, useEffect } from 'react';

const getImageCount = async (folder) => {
  try {
    console.log("getting here ");
    const response = await fetch(`../../../nest-collect/images`);
    console.log("res", response);
    const text = await response.text();
    const parser = new DOMParser();
    const htmlDoc = parser.parseFromString(text, 'text/html');
    const imageElements = htmlDoc.querySelectorAll('a[href$=".jpg"], a[href$=".jpeg"], a[href$=".png"]');
    console.log("here ");
    const l = imageElements.length;
    console.log("the length ", imageElements);
    return l;

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
      <h1>Drawer Opening Analytics</h1>
      <ul>
        <li>Dhyan: {counts.dhyan} times</li>
        <li>Nandan: {counts.nandan} times</li>
        <li>Abhinav: {counts.abhinav} times</li>
        <li>Sumedh: {counts.sumedh} times</li>
      </ul>
    </div>
  );
}

export default App;
