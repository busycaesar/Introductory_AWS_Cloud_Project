// src/routes/api/post.js

const contentType = require('content-type');
const Fragment = require('../../model/fragment');

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

// This API created a new fragments of the received fragment type!
const postFragment = async (req, res) => {
  // Getting the raw binary data from the request body!
  const fragmentRawData = req.body;
  // Getting the type of the data!
  const { type } = contentType.parse(req);

  logger.info(`${req.user} trying to add a new fragment of type ${type}`);

  // If the content type is not one of the supported once, the data in the request's body would not be a buffer!
  if (!Buffer.isBuffer(fragmentRawData)) {
    logger.error({ type }, 'Trying to store unsupported fragment type!');
    // Responding by sending back the error response!
    res
      .status(415)
      .json(createErrorResponse(415, 'Unsupported fragment type requested by the client!'));
    return;
  }

  let newFragment;

  try {
    // Get the size of the file.
    const size = parseInt(req.headers['content-length']);
    // Creating a fragment metadata!

    newFragment = new Fragment({ ownerId: req.user, type: type, size: size });
    // Saving the fragment metadata!
    await newFragment.save();
    // Storing the fragment data!
    await newFragment.setData(fragmentRawData);
  } catch (error) {
    logger.error(`Error while storing the fragment`);
    res.status(500).json(createErrorResponse(500, 'Internal Server Error!'));
    return;
  }

  // Getting the origin of the url!
  const url = process.env.API_URL || req.headers.host,
    // Getting the location of the fragment created in the form of url!
    location = new URL(`/v1/fragments/${newFragment.fragmentId}`, url);

  // Making sure that the location is properly created for the newly created fragment data!
  if (!location) {
    logger.error({ location }, 'Location not generated!');
    res.status(500).json(createErrorResponse(500, 'Internal Server Error!'));
    return;
  }

  logger.debug({ location }, 'Fragment Location');

  // Sending the success response along with the fragment location and meta data upon making sure that the fragment metadata was created!
  res
    .status(201)
    .location(location)
    .json(
      createSuccessResponse({
        fragment: newFragment.getFragmentMetaData(),
      })
    );
};

// Setting the fragments for the current user!
module.exports = { postFragment };
