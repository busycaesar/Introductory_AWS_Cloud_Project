// src/routes/api/post.js

// Creating a router to mount API endpoints!
const express = require('express');
const router = express.Router();

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { isSupportedFragmentType, createFragment } = require('./checkFragments');

// This API created a new fragments of the received fragment type!
router.post('/', (req, res) => {
  // Getting the type of the fragment required by the client!
  const fragmentType = req.get('Content-Type'),
    fragmentRawData = req.body;

  // Making sure that the received fragment type is supported by the application!
  if (!isSupportedFragmentType(fragmentType)) {
    res
      .status(415)
      .json(createErrorResponse(415, 'Unsupported fragment type requested by the client!'));
    return;
  }

  // TODO: Store the meta data and fragments!
  if (createFragment(fragmentRawData, fragmentType))
    res.status(201).json(
      // TODO: Include a location header with full URL to use in order to access newly created fragment!
      createSuccessResponse({
        fragment: {
          // TODO: Include fragment meta data for the newly created fragment!
        },
      })
    );
});

// Setting the fragments for the current user!
module.exports = router;
