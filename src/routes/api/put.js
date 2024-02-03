// src/routes/api/put.js

// Creating a router to mount API endpoints!
const express = require('express');
const router = express.Router();

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const { findFragmentWith, matchFragmentType, updateFragment } = require('./fragmentsUtility');

// This API updates the fragment associated with the passed it, with the new fragment!
router.put('/:id', (req, res) => {
  // Checking the id send by the user!
  const { id } = req.params.id,
    // Checking the type of the fragment requested!
    fragmentType = req.get('Content-Type'),
    // Getting the raw data of the new fragment!
    fragmentRawData = req.body;

  // Getting the fragment associated with the id!
  const fragment = findFragmentWith(id);

  // Making sure that the frafment associated with the id exists! Otherwise responding accordingly!
  if (!fragment) {
    res
      .status(404)
      .json(
        createErrorResponse(404, `Check the id! There is no fragment stored with the id ${id}!`)
      );
    return;
  }

  // Making sure the requested fragment type is the same as the old one. Otherwise, responding accordingly!
  if (!matchFragmentType(fragment, fragmentType)) {
    res
      .status(400)
      .json(
        createErrorResponse(
          400,
          'Check the fragment type requested! The fragment type cannot be chagnes once the fragment is created!'
        )
      );
    return;
  }

  // Updating the fragment and getting the metadata for the new fragment!
  const updatedFragmentMetaData = updateFragment(id, fragmentRawData);

  // Responding success message once the fragment is updated!
  if (updatedFragmentMetaData)
    res.status(200).json(
      createSuccessResponse({
        fragment: updatedFragmentMetaData,
      })
    );
});

module.exports = router;
