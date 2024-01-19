// src/routes/index.js

const express = require('express');

// Information about version and author from package.json!
const {version, author} = require('../../package.json');

// Creating a router to mount APIs!
const router = express.Router();

// Exposing all API routes on /v1/* to include an API version!
router.use('/v1', require('./api'));

// A simple health check router to check if the server is still working!
router.get('/', (req, res) => {
	// Making sure that client dont cache this response!
	res.setHeader('Cache-Control','no-cache');

	res.status(200).json({
		status:'Okay!',
		author,
		githubUrl: 'https://github.com/busycaesar/fragments',
		version,
	});
});

// 404 middleware to handle responses for unavailable resources!
app.use((req, res) => {
  res.status(404).json({
    status: 'Error!',
    error: {
      message: 'Not Found!',
      code: 404,
    },
  });
});

// Error handling middleware!
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Using the status and message from the error object if it is there, otherwise using a generic server error status and message!
  const status = err.status || 500,
    message = err.message || 'Unable to process the request!';

  // Logging something specific so we know if there is any server error!
  if (status > 499) logger.error({ err }, 'Error processing request!');

  res.status(status).json({ status: 'Error!', error: { message, code: status } });
});

module.exports = router;
