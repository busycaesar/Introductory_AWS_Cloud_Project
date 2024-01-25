// jest.confing.js

const path = require("path");
// Getting the full path to the env file having the environment variables required while running tests.
const envFile = path.join(__dirname, "env.jest");

// Reading the environment variables!
require("dotenv").config({ path: envFile });

// Logging the information for the developers!
console.log(`Currently using LOG_LEVEL=${process.env.LOG_LEVEL}. Use 'debug' in env.jest for see more details!`);

module.exports = {
	verbose: true,
	testTimeOut: 5000,
};
