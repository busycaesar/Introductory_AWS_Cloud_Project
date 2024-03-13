// tests/unit/memory.test.js

const memory = require('../../src/model/data/memory');

describe('Memory functions to store fragment data and its metadata', () => {
  test('writeFragment writes the fragment metadata!', async () => {
    // Creating a fragment metadata!
    const fragment = {
      ownerId: '123',
      id: 'abc',
      metaData: 'Testing writeFragment!',
    };
    // Trying the store the fragment metadata created!
    const promiseResult = await memory.writeFragment(fragment.ownerId, fragment.id, fragment);
    // Making sure that the function resolved the promise. In other words, the function successfully stored the metadata.
    expect(promiseResult).resolves;
  });

  test('readFragment should return the stored fragment metadata!', async () => {
    const fragment = {
      ownerId: 'lmnop',
      id: 'xyz',
      metaData: 'Testing readFragment!',
    };
    // Writing the metadata into the database!
    memory.writeFragment(fragment.ownerId, fragment.id, fragment);
    // Calling the function to read the written metadata!
    const _fragment = await memory.readFragment('lmnop', 'xyz');
    // Making sure the function returned the exact metadata stored!
    expect(_fragment).toBe(fragment);
  });

  test('readFragment should not return the fragment metadata with unstored owner and fragment id!', async () => {
    const _fragment = await memory.readFragment('unstored', 'xyz');
    // Making sure the function returned the undefined!
    expect(_fragment).toBe(undefined);
  });

  test('writeFragmentData should resolve the promise!', async () => {
    const fragmentData = 'Testing writeFragmentData!';
    const promiseResult = await memory.writeFragmentData('111', 'check', fragmentData);
    // Making sure that the function resolved the promise. In other words, the function successfully stored the metadata.
    expect(promiseResult).resolves;
  });

  test("readFragmentData should return the stored fragment's data!", async () => {
    const fragment = {
      secretData: 'Testing readFragmentData!',
    };
    // Writing the metadata into the database!
    memory.writeFragmentData('dev', 'fgId', fragment);
    // Calling the function to read the written metadata!
    const _fragment = await memory.readFragmentData('dev', 'fgId');
    // Making sure the function returned the exact metadata stored!
    expect(_fragment).toBe(fragment);
  });

  test('readFragmentData should not return the fragment data with unstored owner and fragment id!', async () => {
    const _fragment = await memory.readFragmentData('unstored', 'xyz');
    // Making sure the function returned the undefined!
    expect(_fragment).toBe(undefined);
  });

  test('listFragments should promise to return a list of fragment ids/objects', async () => {
    // Creating multiple fragment metadata!
    const frag1 = {
        id: '0.0',
        metadata: 'I am the metadata of the fragment!',
        ownerId: '1323',
      },
      frag2 = {
        id: '0.1',
        metadata: 'I should be the metadata of the fragment!',
        ownerId: '1323',
      };
    // Store two fragment metadata!
    memory.writeFragment(frag1.ownerId, frag1.id, frag1);
    memory.writeFragmentData('1323', '0.0', frag1);
    memory.writeFragment(frag2.ownerId, frag2.id, frag2);
    memory.writeFragmentData('1323', '0.1', frag2);
    // Call the listfragment function!
    const fragments1 = await memory.listFragments('1323', true);
    // Make sure it returns both the fragments in an array!
    expect(fragments1).toEqual([frag1, frag2]);
    // Call the listfragment function without expand!
    const fragments2 = await memory.listFragments('1323', false);
    // Make sure it returns only the id of both the fragments!
    expect(fragments2).toEqual([frag1.id, frag2.id]);
    // Deleting both the fragment meta data!
    await memory.deleteFragment('1323', '0.0');
    await memory.deleteFragment('1323', '0.1');
    // Making sure it returns an empty array when no fragments are present!
    expect(await memory.listFragments('1323', true)).toEqual([]);
    // Call the listfragment fuction with wrong owner id!
    // Make sure it returns empty array!
    [true, false].map(async (expand) =>
      expect(await memory.listFragments('not', expand)).toEqual([])
    );
  });
});
