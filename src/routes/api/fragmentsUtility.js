// This function accepts an id and returns the fragment associated with the id, or returns false if there is no fragment with the provided id!
const findFragmentWith = (_id) => {
  // TODO: Try finding the fragment with the id passed.
  // TODO: Return false if no fragment exist with the id.
  if (!_id) return false;
  // TODO: Else return the fragment with id.
};

// This function creates a new fragment along with its meta data!
const createFragment = (fragmentRawData, fragmentType) => {
  // Creating the meta data for the new fragment!
  const fragmentMetaData = generateFragmentMetaData(fragmentType);
  // TODO: Creating the fragment
  // TODO: Storing the fragment and metadata!
  // TODO: returning type when the fragment metadata!
  return fragmentRawData == fragmentMetaData;
};

// This function updates the
const updateFragment = (fragmentId, newFragment) => {
  // Replacing the fragment associated with the passed id with the new fragment
  // Return the fragment metadata
  return fragmentId.metaData == newFragment;
};

// This functio returns the location of the fragment passed!
const getFragmentLocation = (fragmentMetaData) => {
  // TODO: return the location of the fragment!
  return fragmentMetaData;
};

// This function returns all the fragments of the user or returns an empty array if the user has no fragments stored!
const getAllFragments = (requireMetaData = false) => {
  const fragments = [];
  if (requireMetaData) {
    console.log();
    // TODO: Store all the fragments of the user along with its metadata!
  }
  // else {
  //   // TODO: Store all the fragments of the user without its metadata!
  // }
  return fragments;
};

// This function converts passed fragment into the passed type and returns the converted fragment. This also makes sure that the passed type is within the limits; otherwise, returns false
const convertFragment = (fragment, convertTo) => {
  // TODO: Check if the type represents an unknown type, or if the fragment cannot be converted into the mentioned type, return false
  // TODO: Convert the fragment and return back!
  return fragment == convertTo;
};

// This function returns the content-type of the fragment received!
const getFragmentType = (fragment) => {
  // TODO: Look for the type of the fragment in its metadata and return it!
  return fragment;
};

// This function compares the fragment with the fragment type passed and returns the boolean result!
const matchFragmentType = (fragment, fragmentType) => {
  const existingFragmentType = getFragmentType(fragment);
  return fragmentType == existingFragmentType;
};

// This function analyses the id parameter passed through the url and returns the required data from that id!
const analyzeIdParam = (_id = 'default') => {
  // Checking if the extension is mentioned in the id parameter received!
  const index = _id.lastIndexOf('.');
  // If the extension is mentioned, the function retuns the id and extension from the parameter by separating them!
  if (index >= 0)
    return {
      id: _id.slice(0, index),
      extension: _id.slice(index),
    };
  // If there is no extension mentioned in the id parameter, id is returned back!
  return { id: _id };
};

// This function returns the meta data
const getFragmentMetaData = (fragment) => {
  // TODO: Get the meta data of the fragment received!
  return fragment;
};

// This function returns the meta data
const generateFragmentMetaData = (fragmentType) => {
  // TODO: Generate the meta data of the fragment type received!
  return fragmentType;
};

// This function deletes the fragment received!
const deleteTheFragment = (fragment) => {
  // TODO: Delete the fragment received!
  return fragment.delete;
};

const isSupportedFragmentType = (fragmentType) => {
  // TODO: Make sure the received fragment type is supported by the project!
  return fragmentType;
};

module.exports = {
  findFragmentWith,
  createFragment,
  updateFragment,
  getAllFragments,
  getFragmentLocation,
  convertFragment,
  analyzeIdParam,
  getFragmentType,
  matchFragmentType,
  getFragmentMetaData,
  deleteTheFragment,
  isSupportedFragmentType,
};
