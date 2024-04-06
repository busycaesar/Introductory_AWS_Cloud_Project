// src/model/data/aws/index.js

const s3Client = require('./s3Client');
const ddbDocClient = require('./ddbDocClient');
const { PutCommand, GetCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');
const { QueryCommand } = require('@aws-sdk/client-dynamodb');

const writeFragment = async (fragment) => {
  // Configure PUT params, with the name of the table and item.
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Item: fragment,
  };

  const command = new PutCommand(params);

  try {
    return ddbDocClient.send(command);
  } catch (error) {
    logger.warn({ error, params, fragment }, 'error writing fragment to DynamoDB');
  }
};

// Read a fragment's metadata from memory db. Returns a Promise
const readFragment = async (ownerId, id) => {
  // Configure params with ownerId and Id.
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    Key: { ownerId, id },
  };

  const command = new GetCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return data?.Item;
  } catch (error) {
    logger.warn({ error, params }, 'Error reading fragment from DynamoDB');
  }
};

// Write a fragment's data buffer to memory db.
const writeFragmentData = async (ownerId, id, buffer) => {
  // Create params object with bucket and data information.
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
    Body: buffer,
  };

  logger.info({ params }, 'Stroing data into S3');

  // Create a command with the PutObjectCommand instance by passing the params object.
  const command = new PutObjectCommand(params);

  try {
    // Pass the command using s3Client.
    await s3Client.send(command);
  } catch (err) {
    // Get the Bucket and key information from params object to display in case of any error.
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error uploading fragment data to S3.');
    throw new Error('unable to upload fragment data.');
  }
};

// Read a fragment's data from memory db. Returns a Promise
const readFragmentData = async (ownerId, id) => {
  // Create a params object with s3 bucket and key information.
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  // Create an instance of GetObjectCommand class by passing the params object.
  const command = new GetObjectCommand(params);

  try {
    // Get the fragment data by passing the instance of GetObjectCommand.
    const streamData = await s3Client.send(command);
    // Convert the stream of the data to buffer.
    return await streamToBuffer(streamData.Body);
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error streaming fragment data from s3.');
    throw new Error('Unable to read fragment data');
  }
};

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
const listFragments = async (ownerId, expand = false) => {
  // Specify that we want to get all the items where the ownerId is equal to the passed ownerId.
  const params = {
    TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
    KeyConditionExpression: 'ownerId = :ownerId',
    ExpressionAttributeValues: { ':ownerId': ownerId },
  };

  // The projection expression defines the attributes to return.
  // If the expand is not require, only get the id of the fragment.
  if (!expand) params.ProjectionExpression = 'id';

  // Command to send to dynamoDB.
  const command = new QueryCommand(params);

  try {
    const data = await ddbDocClient.send(command);
    return !expand ? data?.Items.map((item) => item.id) : data?.Items;
  } catch (error) {
    logger.error({ error, params }, 'Error getting all fragments for user from DynamoDB');
  }
};

// Delete a fragment's metadata and data from memory db. Returns a Promise
const deleteFragment = async (ownerId, id) => {
  // Create a params object with s3 bucket and key information.
  const paramsS3 = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: `${ownerId}/${id}`,
    },
    paramsDDB = {
      TableName: process.env.AWS_DYNAMODB_TABLE_NAME,
      Key: { ownerId, id },
    };

  // Create an instance of GetObjectCommand class by passing the params object.
  const s3Command = new DeleteObjectCommand(paramsS3);
  const ddbCommand = new DeleteCommand(paramsDDB);

  try {
    await s3Client.send(s3Command);
    await ddbDocClient.send(ddbCommand);
    logger.debug('Fragment deleted.');
  } catch (err) {
    logger.error('Error deleting fragment data.');
    throw new Error('Unable to delete the fragment data.');
  }
};

// Utility Functions.

const streamToBuffer = (stream) => {
  return new Promise((resolve, reject) => {
    // Collect the chunks of data as it streams in.
    const chunks = [];

    stream.on('data', (chunk) => chunks.push(chunk));

    stream.on('error', reject);

    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};

module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
