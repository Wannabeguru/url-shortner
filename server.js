const express = require('express');
const logger = require('./src/middleware/logger');
const urlRoutes = require('./src/routes/url.routes');

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(logger);

// routes
app.use('/api', urlRoutes);
app.use('/', urlRoutes);

// starting server
app.listen(PORT, () => {
  console.log(`URL Shortener running on http://localhost:${PORT}`);
});
