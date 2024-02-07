// tests/unit/fragment.test.js

const Fragment = require('../../src/model/fragment');

describe('Fragment Class', () => {
  test('Checking the constructor and getFragment!', async () => {
    // Creating a new object using construction!
    const _fragment = new Fragment({ id: 'dsa', ownerId: 'asd', type: 'text' });
    // Saving the created object!
    _fragment.save();
    // Trying the fetch the stored fragment using the fragment id and owner id!
    const _storedFragment = await Fragment.getFragment('asd', 'dsa');
    // Checking if the id received is the same and the one stored!
    expect(_storedFragment.id).toBe('dsa');
  });

  test('Checking the getAllFragments functionality!', async () => {
    // Creating new metaData to be stored as a fragment metadata.
    const metaData = { id: 'dsa', ownerId: 'wsc', type: 'text' },
      data2 = { id: 'dsa2', ownerId: 'wsc', type: 'text' };
    // Creating new objects using construction!
    const _fragment = new Fragment(metaData),
      _fragment2 = new Fragment(data2);
    // Saving the created objects!
    _fragment.save();
    _fragment2.save();
    // Trying the fetch all the stored fragments of the owner using the owner id!
    const _allFragments = await Fragment.getAllFragments('wsc');
    // Making sure that the getAllFragments returns an array!
    expect(Array.isArray(_allFragments)).toBe(true);
    // Making sure that the length of the array is two since two metadata is stored!
    expect(_allFragments.length).toBe(2);
    // Checking if the id received is the same and the one stored!
    expect(_allFragments[0]).toBe('dsa');
    expect(_allFragments[1]).toBe('dsa2');
    // Getting all the fragments of the owner along with its details!
    const _allFragmentsWithDetail = await Fragment.getAllFragments('wsc', true);
    // Making sure the object received has all the properties of the metaData stored.
    expect(_allFragmentsWithDetail[0]).toEqual(expect.objectContaining(metaData));
    expect(_allFragmentsWithDetail[1]).toEqual(expect.objectContaining(data2));
  });

  test('Checking the delete functionality!', async () => {
    // Creating a new metaData to be stored as a fragment metadata.
    const metaData = { id: 'dsa', ownerId: 'qen#', type: 'text' };
    // Initiating a new fragment object and passing the metaData.
    const _fragment = new Fragment(metaData);
    // Saving the fragment object to store the metaData.
    await _fragment.save();
    await _fragment.setData({});
    // Deleting the fragment using its id and owner id!
    await Fragment.delete('qen#', 'dsa');
    // Getting the fragment object from the stored fragment metaData by passing the fragment id and owner id!
    const _storedFragment = await Fragment.getFragment('qen#', 'dsa');
    // Making sure the returned stored fragment object is undefined since the fragment is already deleted!
    expect(_storedFragment).toEqual(undefined);
  });

  test('Storing the fragment data!', async () => {
    // Creating a new metaData to be stored as a fragment metadata.
    const metaData = { id: 'dsa', ownerId: 'aus', type: 'text' },
      fragmentData = {
        name: 'Dev',
        designation: 'Developer',
        location: 'Toronto, ON',
      };
    // Initiating a new fragment object and passing the metaData.
    const _fragment = new Fragment(metaData);
    // Saving the fragment object to store the metaData.
    await _fragment.save();
    await _fragment.setData(fragmentData);
    const _storedFragmentData = await _fragment.getData();
    expect(_storedFragmentData).toEqual(fragmentData);
  });

  test('format testing', () => {
    // Creating a few meta datas!
    const metaData = { id: 'dsa', ownerId: 'aus', type: 'text/html; charset=utf-8' },
      metaData2 = { id: 'dsa2', ownerId: 'aus', type: 'dev' };
    // Creating a few fragment objects and passing the meta datas created!
    const _fragment = new Fragment(metaData),
      _fragment2 = new Fragment(metaData2);
    // Testing the mimeType function of the fragment object to make sure it returns expected result according to the stored type in the meta data!
    expect(_fragment.mimeType).toBe('text/html');
    expect(() => _fragment2.mimeType).toThrow();
    // Testing the isText function of the fragment object to make sure it returns the expected result according to the stored type in the meta data!
    expect(_fragment.isText).toBe(true);
    expect(_fragment2.isText).toBe(false);
    // Making sure the formats function of the framgnet object returns an array type!
    expect(Array.isArray(_fragment.formats)).toBe(true);
    // List of supported type by the fragment!
    const supportedType = [
        'text/plain',
        // 'text/markdown',
        // 'text/html',
        // 'text/csv',
        // 'application/json',
        // 'image/png',
        // 'image/jpeg',
        // 'image/webp',
        // 'image/avig',
        // 'image/gif',
      ],
      // Choosing the random index to test the supported type from the list!
      randomIndex = 0; // Math.floor(Math.random() * supportedType.length);
    // Picking a random type from the list and testing the isSupportedType!
    expect(Fragment.isSupportedType(supportedType[randomIndex])).toBe(true);
    // Passing a random string to isSupportedType function to make sure it returns false!
    expect(Fragment.isSupportedType('dev')).toBe(false);
  });
});
