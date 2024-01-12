// Importing required libraries and files!

const stoppable = require('stoppable');
const logger = require('./logger');
const app = require('./app');

const PORT = parseInt(process.env.PORT || '8080', 10);

// Initiate the server to listen on the port!
const server = stoppable(
  app.listen(PORT, () =>
    // Logging a message when the server starts listening!
    logger.info(`Server is listening on PORT ${PORT}`)
  )
);

// Exporting the server for other parts of the code if it is require!
module.exports = server;
