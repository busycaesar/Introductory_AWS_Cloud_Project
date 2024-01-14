// Using info as a standard log level if it is not specified!
const options = { level: process.env.LOG_LEVEL || 'info' };

// In case if there is debug logging, adding some properties to make the logs easier to read!
if (options.level === 'debug') {
  options.transport = {
    target: 'pino-pretty',
    options: { colorize: true },
  };
}

// Creating and exporting an instance of a Pino Logger!
module.exports = require('pino')(options);
