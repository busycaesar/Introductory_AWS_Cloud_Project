// Use crypto.randomUUID() to create unique IDs, see:
// https://nodejs.org/api/crypto.html#cryptorandomuuidoptions
const { randomUUID } = require('crypto');
// Use https://www.npmjs.com/package/content-type to create/parse Content-Type headers
const contentType = require('content-type');
const markdownIt = require('markdown-it');
const sharp = require('sharp');
const md = markdownIt();
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
    created = new Date().toString(),
    updated = new Date().toString(),
    type,
    size = 0,
  }) {
    this.fragmentId = id;
    this.fragmentOwnerId = ownerId;
    this.fragmentCreated = created;
    this.fragmentUpdated = updated;
    this.fragmentType = type;
    this.fragmentSize = size;
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

  getFragmentMetaData = () => {
    return {
      id: this.fragmentId,
      ownerId: this.fragmentOwnerId,
      created: this.fragmentCreated,
      updated: this.fragmentUpdated,
      type: this.fragmentType,
      size: this.fragmentSize,
    };
  };

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  async save() {
    this.fragmentUpdated = new Date();
    await writeFragment(this.getFragmentMetaData());
  }

  /**
   * Get the fragment's data from the database
   * @returns Promise<Buffer>
   */
  async getData() {
    return await readFragmentData(this.fragmentOwnerId, this.fragmentId);
  }

  setSize(size) {
    this.fragmentSize = size;
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    // Updating the fragment meta data's update key with the recent date and time!
    this.fragmentUpdated = new Date().toString();
    // Storing the updated fragment meta data!
    await writeFragment(this.getFragmentMetaData());
    // Storing the fragment data!
    await writeFragmentData(this.fragmentOwnerId, this.fragmentId, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    try {
      const { type } = contentType.parse(this.fragmentType);
      return type;
    } catch (error) {
      throw new Error('Invalid content type!');
    }
  }

  mimeTypeOf(extension) {
    const mimeType = {
      '.txt': 'text/plain',
      '.md': 'text/markdown',
      '.html': 'text/html',
      '.csv': 'text/csv',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpeg': 'image/jpeg',
      '.webp': 'image/webp',
      '.avif': 'image/avif',
    };
    console.log(mimeType[extension]);
    return mimeType[extension];
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    const typeStart = /^text\/.*/i;
    return typeStart.test(this.fragmentType);
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    const validConversions = {
      'text/plain': ['.txt'],
      'text/markdown': ['.md', '.html', '.txt'],
      'text/html': ['.html', '.txt'],
      'text/csv': ['.csv', '.txt', '.json'],
      'application/json': ['.json', '.txt'],
      'image/png': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      'image/jpeg': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      'image/webp': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      'image/avif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
      'image/gif': ['.png', '.jpg', '.webp', '.gif', '.avif'],
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
      'image/png',
      'image/jpeg',
      'image/webp',
      'image/avig',
      'image/gif',
    ];
    // Returning the boolean if the value passed, is supported!
    return supportedType.includes(value);
  }

  async getConvertedInto(type) {
    const fragmentData = await this.getData(),
      fragmentType = this.getFragmentMetaData().type;
    // Convert fragment data into the received type.
    if (fragmentType === 'text/plain' && type === '.txt') return fragmentData;
    else if (fragmentType === 'text/markdown' && type === '.md') return fragmentData;
    else if (fragmentType === 'text/html' && type === '.html') return fragmentData;
    else if (fragmentType === 'text/csv' && type === '.csv') return fragmentData;
    else if (fragmentType === 'application/json' && type === '.json') return fragmentData;
    else if (fragmentType === 'image/png' && type === '.png') return fragmentData;
    else if (fragmentType === 'image/jpeg' && type === '.jpeg') return fragmentData;
    else if (fragmentType === 'image/webp' && type === '.webp') return fragmentData;
    else if (fragmentType === 'image/avif' && type === '.avif') return fragmentData;
    else if (fragmentType === 'image/gif' && type === '.gif') return fragmentData;
    else if (fragmentType === 'text/markdown' && type === '.html') return md.render(fragmentData);
    else if (fragmentType === 'text/markdown' && type === '.txt')
      return fragmentData.toString('utf8');
    else if (fragmentType === 'text/html' && type === '.txt') return fragmentData.toString('utf8');
    else if (fragmentType === 'text/csv' && type === '.txt') return fragmentData.toString('utf8');
    else if (fragmentType === 'text/csv' && type === '.json') return fragmentData;
    else if (fragmentType === 'application/json' && type === '.txt')
      return fragmentData.toString('utf8');
    else if (fragmentType.startsWith('image/')) {
      const image = sharp(fragmentData);
      if (type === '.png') return image.png().toBuffer();
      else if (type === '.jpeg') return image.jpeg().toBuffer();
      else if (type === '.webp') return image.webp().toBuffer();
      else if (type === '.avif') return image.avif().toBuffer();
    }
  }
}

module.exports = Fragment;
