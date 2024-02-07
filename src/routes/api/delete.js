// // src/routes/api/delete.js

// // Creating a router to mount API endpoints!
// const express = require('express');
// const router = express.Router();

// // Importing all the utility functions helpful in creating the response!
// const { createSuccessResponse, createErrorResponse } = require('../../response');
// const { findFragmentWith, deleteTheFragment } = require('./fragmentsUtility');

// // This API deletes the fragments associated with the received Id!
// router.delete('/:id', (req, res) => {
//   // Getting the id from the parameter!
//   const fragmentId = req.params.id;
//   // Getting the fragment associated with the id received!
//   const fragment = findFragmentWith(fragmentId);

//   // Making sure that the fragment associated with the id received exists! If not responding accordingly!
//   if (!fragment) {
//     res
//       .status(404)
//       .json(
//         createErrorResponse(
//           404,
//           `Check the id! There is no fragment stored with the id ${fragmentId}!`
//         )
//       );
//     return;
//   }

//   // Deleting the fragment and responding accordingly!
//   if (deleteTheFragment(fragment)) res.status(200).json(createSuccessResponse());
// });

// module.exports = router;
