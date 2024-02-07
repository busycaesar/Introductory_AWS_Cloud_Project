// src/routes/api/post.js

// Creating a router to mount API endpoints!
const express = require('express');
const router = express.Router();

const contentType = require('content-type');
const Fragment = require('../../model/fragment');

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');

/**
 * This is a middleware function which have several checks for the received data through request's body.
 * The major check is making sure that the type of the data in the request's body is one of the supported type or not.
 * First it will make sure that the content type mentioned in the request's header, is one of the supported type using the Fragment object's isSupportedType method.
 * If it would be a supported type, the express would parse the raw binary data from the request body, otherwise, if the content type mentioned is not one of the supported type, the express would put an empty object in the request's body!
 */
const rawBody = () =>
  express.raw({
    inflate: true,
    limit: '5mb',
    type: (req) => {
      const { type } = contentType.parse(req);
      return Fragment.isSupportedType(type);
    },
  });

// This API created a new fragments of the received fragment type!
router.post('/', rawBody(), async (req, res) => {
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
  const URLOrigin = process.env.API_URL || req.headers.host,
    // Getting the location of the fragment created in the form of url!
    location = new URL(`/v1/fragments/${newFragment.fragmentMetaData.id}`, URLOrigin);

  // Sending the success response along with the fragment location and meta data upon making sure that the fragment metadata was created!
  if (newFragment.fragmentMetaData)
    res
      .status(201)
      .location(location)
      .json(
        createSuccessResponse({
          fragment: newFragment.fragmentMetaData,
        })
      );
});

// Setting the fragments for the current user!
module.exports = router;
