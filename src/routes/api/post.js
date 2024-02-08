// src/routes/api/post.js

const contentType = require('content-type');
const Fragment = require('../../model/fragment');
require('dotenv').config();

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');

// This API created a new fragments of the received fragment type!
const postFragment = async (req, res) => {
  // Getting the raw binary data from the request body!
  const fragmentRawData = req.body;
  // Getting the type of the data!
  const { type } = contentType.parse(req);

  // If the content type is not one of the supported once, the data in the request's body would not be a buffer!
  if (!Buffer.isBuffer(fragmentRawData)) {
    // Responding by sending back the error response!
    res
      .status(415)
      .json(createErrorResponse(415, 'Unsupported fragment type requested by the client!'));
    return;
  }

  // Creating a fragment metadata!
  const newFragment = new Fragment({ ownerId: req.user, type: type });
  // Saving the fragment metadata!
  await newFragment.save();
  // Storing the fragment data!
  await newFragment.setData(fragmentRawData);

  // Getting the origin of the url!
  const URLOrigin = process.env.API_URL || req.headers.host || 'defined',
    // Getting the location of the fragment created in the form of url!
    location = new URL(`/v1/fragments/${newFragment.fragmentMetaData.id}`, URLOrigin);

  // Making sure that the location is properly created for the newly created fragment data!
  if (!location) res.status(500).json(createErrorResponse(500, 'Internal Server Error!'));

  // Sending the success response along with the fragment location and meta data upon making sure that the fragment metadata was created!
  res
    .status(201)
    .location(location)
    .json(
      createSuccessResponse({
        fragment: newFragment.fragmentMetaData,
      })
    );
};

// Setting the fragments for the current user!
module.exports = { postFragment };
