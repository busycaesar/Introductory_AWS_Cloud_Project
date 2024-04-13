// test/unit/post.test.js

const request = require('supertest');
const app = require('../../src/app');

describe('DELETE /Fragments', () => {
  // Unauthorized users cannot delete a fragment.
  test('Unauthorized users cannot delete a fragment.', async () => {
    // Save a fragment with valid user id.
    const fragmentData = 'This is first fragment data!';
    const postResponse = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/plain')
        .send(fragmentData),
      fragmentMetaData = postResponse.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(postResponse.status).toBe(201);
    // Get the fragment id.
    const fragmentId = fragmentMetaData.id;
    // Try to delete the fragment with the id and invalid credentials.
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('invalid@email.com', 'ps1');
    // Expect it to throw the error.
    expect(deleteResponse.status).toBe(401);
  });

  // Authorized users can delete a fragment.
  test('Authorized users can delete a fragment.', async () => {
    // Save a fragment with valid user id.
    const fragmentData = 'This is first fragment data!';
    const postResponse = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/plain')
        .send(fragmentData),
      fragmentMetaData = postResponse.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(postResponse.status).toBe(201);
    // Get the fragment id.
    const fragmentId = fragmentMetaData.id;
    // Try to delete the fragment with the id.
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'ps1');
    // Expect it to throw the error.
    expect(deleteResponse.status).toBe(201);
  });
  // Authorized users cannot delete a fragment with invalid id.
  test('Authorized users cannot delete a fragment with invalid id.', async () => {
    // Try to delete the fragment with invalid id.

    const fragmentId = 1234;
    const deleteResponse = await request(app)
      .delete(`/v1/fragments/${fragmentId}`)
      .auth('user1@email.com', 'ps1')
      .set('Content-Type', 'text/plain');
    // Expect it to throw the error.
    expect(deleteResponse.status).toBe(404);
  });
});
