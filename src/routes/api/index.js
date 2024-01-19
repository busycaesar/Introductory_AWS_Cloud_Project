// src/routes/api/index.js

const express = require('express');

// Creating a router to mount API endpoints!
const router = express.Router();

router.get('/fragments', require('./get'));

module.exports = router;
