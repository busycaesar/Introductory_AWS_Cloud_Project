// src/routes/api/delete.js

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment');
const logger = require('../../logger');

const deleteFragment = async (req, res) => {
  // Getting the id from the parameter!
  const fragmentId = req.params.id;
  const ownerId = req.user;

  logger.debug(`Delete the fragment ${fragmentId}`);

  try {
    await Fragment.delete(ownerId, fragmentId);
    res.status(201).json(createSuccessResponse('Fragment delete successfully.'));
  } catch (error) {
    logger.warn({ fragmentId }, 'No fragment found with the id.');
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          `Check the id! There is no fragment stored with the id ${fragmentId}!`
        )
      );
  }
};

module.exports = { deleteFragment };
