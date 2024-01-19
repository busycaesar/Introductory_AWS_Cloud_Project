// src/routes/index.js

const express = require('express');

// Information about version and author from package.json!
const { version, author } = require('../../package.json');

// Authentication middleware!
const { authenticate } = require('../auth');

// Creating a router to mount APIs!
const router = express.Router();

// Exposing all API routes on /v1/* to include an API version!
// Protecting all of router on /v1/* to use authenticate middleware!
router.use('/v1', authenticate(), require('./api'));

// A simple health check router to check if the server is still working!
router.get('/', (req, res) => {
  // Making sure that client dont cache this response!
  res.setHeader('Cache-Control', 'no-cache');

  res.status(200).json({
    status: 'Okay!',
    author,
    githubUrl: 'https://github.com/busycaesar/fragments',
    version,
  });
});

// 404 middleware to handle responses for unavailable resources!
router.use((req, res) => {
  res.status(404).json({
    status: 'Error!',
    error: {
      message: 'Not Found!',
      code: 404,
    },
  });
});

module.exports = router;
