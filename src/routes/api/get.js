// src/routes/api/get.js

// Importing all the utility functions helpful in creating the response!
const { createSuccessResponse, createErrorResponse } = require('../../response');
const Fragment = require('../../model/fragment');

// This API sends all the fragments of the user in an array!
const getFragments = async (req, res) => {
  // If the requst has a query "expand = 1", the user is send all the fragments along with its meta data. Otherwise, just an array of fragments!
  const userFragments = await Fragment.getAllFragments(req.user, req.query.expand);
  res?.status(200).json(createSuccessResponse({ fragments: userFragments }));
};

// // This API get the id and sends the fragment associated with that id!
// const getFragmentUsingId = (req, res) => {
//   // Checking the id send by the user!
//   const { id } = req.params.id;

//   // Analysing the id send by the user to check if the entension is included with the id or not!
//   const { fragmentId, extension } = analyzeIdParam(id);

//   // Getting the fragment with the id passed by the client!
//   const fragment = findFragmentWith(fragmentId);

//   // If no fragment exist with the passed id, responding with the error message!
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

//   // Storing the type of the fragment, if there is an extension type passed by the client or using the existing type of the fragment used while storing the fragment!
//   const fragmentType = extension || getFragmentType(fragment);

//   // Converting the fragment into the required type!
//   const convertedFragment = convertFragment(fragment, fragmentType);

//   // If the fragment cannot be converted into the required type, sending the appropriate error message!
//   if (!convertedFragment) {
//     res
//       .status(415)
//       .json(
//         createErrorResponse(415, 'The fragment cannot be converted into the extension specified!')
//       );
//     return;
//   }

//   // Finally responding with the converted fragment!
//   res.status(200).json(createSuccessResponse({ fragment: convertedFragment }));
// };

// This API get the id and sends the metadata of the fragment associated with that id!
const getFragmentInfoUsingId = async (req, res) => {
  // Getting the fragment id!
  const fragmentId = req.params.id;
  // Getting the fragment metadata with the fragment and owner id!
  const fragmentMetaData = await Fragment.getFragment(req.user, fragmentId);
  // Making sure the fragment meta data associated with the id received exists!
  if (!fragmentMetaData) {
    res
      .status(404)
      .json(
        createErrorResponse(
          404,
          `Check the id! There is no fragment stored with the id ${fragmentId}!`
        )
      );
    return;
  }

  // Responding to the request with the meta data of the fragment!
  res.status(201).json(createSuccessResponse({ fragment: fragmentMetaData }));
};

module.exports = {
  getFragments,
  // getFragmentUsingId,
  getFragmentInfoUsingId,
};
