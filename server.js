const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

const urlDatabase = new Map();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

function generateShortCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 6;
  let shortCode = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }

  if (urlDatabase.has(shortCode)) {
    return generateShortCode();
  }

  return shortCode;
}

app.post('/api/shorten', (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    new URL(url);
  } catch (error) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const shortCode = generateShortCode();
  urlDatabase.set(shortCode, url);

  const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

  res.json({
    originalUrl: url,
    shortUrl: shortUrl,
    shortCode: shortCode
  });
});

app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  const originalUrl = urlDatabase.get(shortCode);

  if (!originalUrl) {
    return res.status(404).send('short URL not found');
  }

  res.redirect(originalUrl);
});

app.listen(PORT, () => {
  console.log(`URL Shortener running on http://localhost:${PORT}`);
});
