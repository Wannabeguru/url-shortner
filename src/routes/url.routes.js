const express = require('express');
const router = express.Router();
const yup = require('yup');
const { urlSchema } = require('../validators/url.validator');
const generateShortCode = require('../utils/generateShortCode');

const urlDatabase = new Map();

router.post('/shorten', async (req, res) => {
  try {
    console.log('Received request body:', JSON.stringify(req.body, null, 2));
    console.log('URL being validated:', req.body.url);
    const validatedData = await urlSchema.validate(req.body, { abortEarly: false });
    const { url } = validatedData;

    const shortCode = generateShortCode(urlDatabase);
    urlDatabase.set(shortCode, url);

    console.log('here is the host', req.get('host'));
    const shortUrl = `${req.protocol}://${req.get('host')}/${shortCode}`;

    console.log(`created short code: ${shortCode} for ${url}`);

    res.json({
      originalUrl: url,
      shortUrl: shortUrl,
      shortCode: shortCode
    });
  } catch (error) {
    if (error instanceof yup.ValidationError) {
      return res.status(400).json({
        error: error.errors[0] || 'Validation failed'
      });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;

  const originalUrl = urlDatabase.get(shortCode);

  if (!originalUrl) {
    console.log(`short code not found: ${shortCode}`);
    return res.status(404).send('short URL not found');
  }

  console.log(`redirecting ${shortCode} to ${originalUrl}`);
  res.redirect(originalUrl);
});

module.exports = router;
