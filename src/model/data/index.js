// src/model/data/index.js

// Use aws backend service if env variables sets the AWS Region, in-memory otherwise.
module.exports = process.env.AWS_REGION ? require('./aws') : require('./memory');
