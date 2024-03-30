// src/model/data/aws/index.js

const MemoryDB = require('../memory/memory-db');
const s3Client = require('./s3Client');
const { PutObjectCommand, GetObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const logger = require('../../../logger');

// Create in-memory database to store fragments metadata.
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
const writeFragment = async (ownerId, id, fragment) => await metadata.put(ownerId, id, fragment);

// Read a fragment's metadata from memory db. Returns a Promise
const readFragment = async (ownerId, id) => await metadata.get(ownerId, id);

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
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) return fragments;

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
};

// Delete a fragment's metadata and data from memory db. Returns a Promise
const deleteFragment = async (ownerId, id) => {
  // Create a params object with s3 bucket and key information.
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME,
    Key: `${ownerId}/${id}`,
  };

  // Create an instance of GetObjectCommand class by passing the params object.
  const command = new DeleteObjectCommand(params);

  try {
    await s3Client.send(command);
    await metadata.del(ownerId, id);
    logger.debug('Fragment deleted.');
  } catch (err) {
    const { Bucket, Key } = params;
    logger.error({ err, Bucket, Key }, 'Error deleting fragment data from s3.');
    throw new Error('Unable to delete the fragment data');
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
