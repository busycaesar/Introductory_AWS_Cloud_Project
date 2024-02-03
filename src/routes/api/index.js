// src/routes/api/index.js

const express = require('express');

// Creating a router to mount API endpoints!
const router = express.Router();

router.get('/fragments', require('./get'));

router.post('/fragments', require('./post'));

router.put('/fragments', require('./put'));

router.delete('/fragments', require('./delete'));

module.exports = router;
