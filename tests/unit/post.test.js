// test/unit/post.test.js

const request = require('supertest');

const app = require('../../src/app');
const Fragment = require('../../src/model/fragment');

describe('POST /Fragments', () => {
  // Making sure for all the unauthorized requests, the status code of 401 is sent!
  test('unauthenticated requests are denied', async () => {
    // Requesting without any credentials!
    await request(app).post('/v1/fragments').expect(401);
    // Requesting with unauthorized credentials!
    await request(app)
      .post('/v1/fragments')
      .auth('invalid@email.com', 'incorrect_password')
      .expect(401);
  });

  test('authorized users are not able to store the fragments in any other type than text/plain', async () => {
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'ps1')
      .set('Content-Type', 'text/html')
      .send('This is unsupported data format!');
    expect(response.status).toBe(415);
    expect(response.body.status).toBe('Error!');
  });

  // Making sure that the users are able to stored the data in fragments!
  test('authorized users are able to store the fragments', async () => {
    // Posting the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/plain')
        .send('This is first fragment data!'),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetching the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe('This is first fragment data!');
    const _storedFragmentMetaData = await Fragment.getAllFragments(fragmentMetaData.ownerId, false);
    expect(Array.isArray(_storedFragmentMetaData)).toBe(true);
    expect(_storedFragmentMetaData[0]).toBe(fragmentMetaData.id);
  });
});
