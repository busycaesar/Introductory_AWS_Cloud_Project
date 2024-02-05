// tests/unit/memory.test.js

const memory = require('../../src/model/data/memory');

describe('Memory functions to store fragment data and its metadata', () => {
  test('writeFragment writes the fragment metadata!', async () => {
    const fragment = {
      ownerId: '123',
      id: 'abc',
      metaData: 'Testing writeFragment!',
    };
    const promiseResult = await memory.writeFragment(fragment);
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
    memory.writeFragment(fragment);
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
});
