// jest.confing.js

const path = require('path');
// Getting the full path to the env file having the environment variables required while running tests.
const envFile = path.join(__dirname, 'env.jest');

const logger = require('./src/logger');

// Reading the environment variables!
// It is important to pass the path to the enviroment file since we have a special custom file to store the environment variables for jest vs .env which we use to store the information used in the server.js file!
require('dotenv').config({ path: envFile });

// Logging the information for the developers!
logger.info(
  `Currently using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for see more details!`
);

module.exports = {
  // Verbose: true makes the jest output more detailed information during the test runs!
  verbose: true,
  // If a test takes more than 5 seconds, it is considered is already failed!
  testTimeout: 5000,
};
