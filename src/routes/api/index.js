// src/routes/api/index.js

// Creating a router to mount API endpoints!
const express = require('express');
const router = express.Router();

// HTTP request methods for /fragments API!

router.get('/fragments', require('./get'));

router.post('/fragments', require('./post'));

router.put('/fragments', require('./put'));

router.delete('/fragments', require('./delete'));

module.exports = router;
