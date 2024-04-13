// src/routes/api/put.js

const Fragment = require('../../model/fragment');

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

// This API updates the fragment associated with the passed id, with the new fragment!
const updateFragment = async (req, res) => {
  // Checking the id send by the user!
  const { id } = req.params.id,
    // Checking the type of the fragment requested!
    fragmentType = req.get('Content-Type'),
    // Getting the raw data of the new fragment!
    fragmentRawData = req.body;

  // Getting the fragment associated with the id!

  // Making sure that the fragment associated with the id exists! Otherwise responding accordingly!

  // Making sure the requested fragment type is the same as the old one. Otherwise, responding accordingly!

  // Updating the fragment and getting the metadata for the new fragment!

  // Responding success message once the fragment is updated!
};

module.exports = { updateFragment };
