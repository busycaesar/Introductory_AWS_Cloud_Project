// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  writeFragmentData,
  listFragments,
  deleteFragment,
} = require('./data');

class Fragment {
  /**
   * Importes the detail of a fragment object. If there id is not passed, creates a new object; otherwise, imports the details of the existing object associated with the id!
   * @param {object} fragment
   */
  constructor({
    id = randomUUID(),
    ownerId,
    created = new Date(),
    updated = new Date(),
    type,
    size = 0,
  }) {
    this.fragmentMetaData = { id, ownerId, created, updated, type, size };
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async getAllFragments(ownerId, expand = false) {
    return await listFragments(ownerId, expand);
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async getFragment(ownerId, id) {
    return await readFragment(ownerId, id);
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static async delete(ownerId, id) {
    return await deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.fragmentMetaData.updated = new Date();
    await writeFragment(this.fragmentMetaData);
  }

  /**
   * Get the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.fragmentMetaData.ownerId, this.fragmentMetaData.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // Updating the fragment meta data's update key with the recent date and time!
    this.fragmentMetaData.updated = new Date();
    // Storing the updated fragment meta data!
    await writeFragment(this.fragmentMetaData);
    // Storing the fragment data!
    await writeFragmentData(this.fragmentMetaData.ownerId, this.fragmentMetaData.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    try {
      const { type } = contentType.parse(this.fragmentMetaData.type);
      return type;
    } catch (error) {
      throw new Error('Invalid content type!');
    }
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const typeStart = /^text\/.*/i;
    return typeStart.test(this.fragmentMetaData.type);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const validConversions = {
      'text/plain': ['.txt'],
      'text/markdown': [
        '.md',
        '.html',
        //  '.txt'
      ],
      // 'text/html': ['.html', '.txt'],
      // 'text/csv': ['.csv', '.txt', '.json'],
      // 'application/json': ['.json', '.txt'],
      // 'image/png': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      // 'image/jpeg': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      // 'image/webp': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      // 'image/avif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      // 'image/gif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
    };
    // Returns the text/plain because for this assignment we are only supporting the text/plain type!
    return validConversions[this.mimeType] || false;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    // Array of all the supported types!
    const supportedType = [
      'text/plain',
      'text/markdown',
      'text/html',
      'text/csv',
      'application/json',
      // 'image/png',
      // 'image/jpeg',
      // 'image/webp',
      // 'image/avig',
      // 'image/gif',
    ];
    // Returning the boolean if the value passed, is supported!
    return supportedType.includes(value);
  }
}

module.exports = Fragment;
