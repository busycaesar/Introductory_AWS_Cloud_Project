// src/routes/api/put.js

const Fragment = require('../../model/fragment');

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const logger = require('../../logger');

// This API updates the fragment associated with the passed id, with the new fragment!
const updateFragment = async (req, res) => {
  // Checking the id send by the user!
  const { id } = req.params,
    // Checking the type of the fragment requested!
    fragmentType = req.get('Content-Type'),
    // Getting the raw data of the new fragment!
    fragmentRawData = req.body,
    ownerId = req.user;
  let fragmentMetaData, fragment;

  try {
    // Get the fragments meta data using the fragment id and owner id.
    fragmentMetaData = await Fragment.getFragment(ownerId, id);

    logger.debug({ fragmentMetaData }, `Fragment metadata ${id}`);

    // Getting the fragment associated with the id!
    fragment = new Fragment(fragmentMetaData);
  } catch (error) {
    logger.error(`No fragments found with id ${id}`);
    res
      .status(404)
      .json(
        createErrorResponse(404, `Check the id! There is no fragment stored with the id ${id}!`)
      );
    return;
  }

  // Making sure the requested fragment type is the same as the old one. Otherwise, responding accordingly!
  if (fragmentType != fragmentMetaData.fragmentType) {
    logger.error(`Cannot change type of the fragment.`);
    res
      .status(415)
      .json(createErrorResponse(415, `Cannot change type of the fragment to ${fragmentType}!`));
    return;
  }

  try {
    // Update content length
    const size = parseInt(req.headers['content-length']);
    fragment.setSize(size);
    // Updating the fragment and getting the metadata for the new fragment!
    await fragment.setData(fragmentRawData);
    // Responding success message once the fragment is updated!
    res.status(201).json(
      createSuccessResponse({
        fragment: fragment.getFragmentMetaData(),
      })
    );
  } catch (error) {
    res.status(500).json(createErrorResponse(500, `Internal server error`));
  }
};

module.exports = { updateFragment };
