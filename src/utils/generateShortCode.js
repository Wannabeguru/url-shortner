function generateShortCode(urlDatabase) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const codeLength = 6;
  let shortCode = '';

  for (let i = 0; i < codeLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    shortCode += characters[randomIndex];
  }

  if (urlDatabase.has(shortCode)) {
    return generateShortCode(urlDatabase);
  }

  return shortCode;
}

module.exports = generateShortCode;
