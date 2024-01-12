// Importing required libraries and files!

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

const logger = require('./logger');
const pino = require('pino-http')({ logger });

const { author, version } = require('../package.json');

const app = express();

// Middlewares

app.use(pino);
app.use(helmet());
app.use(cors());
app.use(compression());

// Routes

// Simple health check route to make sure if the server is running!
app.get('/', (req, res) => {
  // Client should not cache this response!
  res.setHeader('Cache-Control', 'no-cache');

  // Sending "okay!" along with the repo information!
  res.status(200).json({
    status: 'okay!',
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

// Exporting the app to access it in server.js
module.exports = app;
