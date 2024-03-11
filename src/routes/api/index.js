// src/routes/api/index.js

// Creating a router to mount API endpoints!
const express = require('express');
const router = express.Router();

const { getFragments, getFragmentUsingId, getFragmentInfoUsingId } = require('./get');
const { postFragment } = require('./post');
const rawBody = require('./rawBody');

// HTTP request methods for /fragments API!

// GET method!
router.get('/fragments', getFragments);
router.get('/fragments/:id', getFragmentUsingId);
router.get('/fragments/:id/info', getFragmentInfoUsingId);

// POST method
router.post('/fragments', rawBody(), postFragment);

// PUT method
// router.put('/fragments', require('./put'));

// DELETE method
// router.delete('/fragments', require('./delete'));

module.exports = router;
