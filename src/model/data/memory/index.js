const MemoryDB = require('./memory-db');
// Create two in-memory databases: one for fragment metadata and the other for raw data
const data = new MemoryDB();
const metadata = new MemoryDB();

// Write a fragment's metadata to memory db. Returns a Promise
const writeFragment = async (fragment) =>
  await metadata.put(fragment.ownerId, fragment.id, fragment);

// Read a fragment's metadata from memory db. Returns a Promise
const readFragment = async (ownerId, id) => await metadata.get(ownerId, id);

// Write a fragment's data buffer to memory db. Returns a Promise
const writeFragmentData = async (ownerId, id, buffer) => await data.put(ownerId, id, buffer);

// Read a fragment's data from memory db. Returns a Promise
const readFragmentData = async (ownerId, id) => await data.get(ownerId, id);

// Get a list of fragment ids/objects for the given user from memory db. Returns a Promise
const listFragments = async (ownerId, expand = false) => {
  const fragments = await metadata.query(ownerId);

  // If we don't get anything back, or are supposed to give expanded fragments, return
  if (expand || !fragments) return fragments;

  // Otherwise, map to only send back the ids
  return fragments.map((fragment) => fragment.id);
};

// Delete a fragment's metadata and data from memory db. Returns a Promise
const deleteFragment = async (ownerId, id) =>
  Promise.all([
    // Delete metadata
    metadata.del(ownerId, id),
    // Delete data
    data.del(ownerId, id),
  ]);

module.exports = {
  listFragments,
  writeFragment,
  readFragment,
  writeFragmentData,
  readFragmentData,
  deleteFragment,
};
