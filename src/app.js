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
app.use('/',require('./routes'))

// Exporting the app to access it in server.js
module.exports = app;
