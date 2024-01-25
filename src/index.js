// src/index.js

// This helps to read variables from .env file!
require('dotenv').config();

// Helps to log any crash/information required/vital while debugging!
const logger = require('./logger');

// This is purposely added to get the error message from GitHub actions!
const unneededVariable = 'This varibles is never used!';

// If the app crashes due to an uncaught exception, it will be logged first!
process.on('uncaughtException', (err, origin) => {
  logger.fatal({ err, origin }, 'uncaughtException');
  throw err;
});

// If the app crashes due to unhandled promise rejection, it will be logged first!
process.on('unhandledRejection', (reason, promise) => {
  logger.fatal({ reason, promise }, 'unhandledRejection');
  throw reason;
});

require('./server');
