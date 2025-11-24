// server/index.js
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch'); // v2

const app = express();
const PORT = 4000; // proxy will run on http://localhost:4000

app.use(cors());

// Helper: validate that the image URL is from a NASA domain
function isAllowedNasaUrl(imageUrl) {
  try {
    const url = new URL(imageUrl);
    return url.hostname.endsWith('nasa.gov');
  } catch (e) {
    return false;
  }
}

// GET /proxy-image?url=<imageUrl>
app.get('/proxy-image', async (req, res) => {
  const imageUrl = req.query.url;

  if (!imageUrl) {
    return res.status(400).send('Missing "url" query parameter.');
  }

  if (!isAllowedNasaUrl(imageUrl)) {
    return res.status(400).send('Only NASA-hosted image URLs are allowed.');
  }

  try {
    console.log('Proxying image:', imageUrl);

    const response = await fetch(imageUrl);

    if (!response.ok) {
      console.error('NASA responded with status:', response.status);
      return res
        .status(response.status)
        .send('Failed to fetch image from NASA.');
    }

    const contentType =
      response.headers.get('content-type') || 'image/jpeg';
    const buffer = await response.buffer(); // ⬅️ get image as a Buffer

    res.setHeader('Content-Type', contentType);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.end(buffer); // ⬅️ send the raw bytes
  } catch (err) {
    console.error('Error in /proxy-image:', err);
    res.status(500).send('Error fetching image.');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
