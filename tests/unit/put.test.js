const request = require('supertest');
const fs = require('fs');
const absolutePath = 'tests/unit/sampleFile';
const app = require('../../src/app');
const Fragment = require('../../src/model/fragment');

describe('PUT /fragment', () => {
  test('Authorized users are not able to update the fragment with invalid id', async () => {
    const putResponse = await request(app)
      .put(`/v1/fragments/invalid`)
      .auth('user1@email.com', 'ps1')
      .set('Content-Type', 'text/plain')
      .send('This is the updated data');
    // Make sure the fragment updated
    expect(putResponse.status).toBe(404);
  });

  test('Authorized users are able to update the fragment(text/plain)', async () => {
    const userEmail = 'user1@email.com';
    // Post a fragment
    const data = 'This is first fragment data!';
    // Posting the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth(userEmail, 'ps1')
        .set('Content-Type', 'text/plain')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment,
      fragmentId = fragmentMetaData.id;
    // Make sure the fragment is stored
    const fragment = new Fragment(fragmentMetaData);
    // Update the fragment
    const updatedData = 'This is the updated data';
    const putResponse = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth(userEmail, 'ps1')
      .set('Content-Type', 'text/plain')
      .send(updatedData);
    // Make sure the fragment updated
    expect(putResponse.status).toBe(201);
    expect(await fragment.getData()).toEqual(Buffer.from(updatedData));
  });

  test('Authorized users are not able to update the type of the fragment', async () => {
    const userEmail = 'user1@email.com';
    // Post a fragment
    const data = 'This is first fragment data!';
    // Posting the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth(userEmail, 'ps1')
        .set('Content-Type', 'text/plain')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment,
      fragmentId = fragmentMetaData.id;
    // Update the fragment
    const updatedData = fs.readFileSync(`${absolutePath}/wallpaper.jpeg`);
    const putResponse = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth(userEmail, 'ps1')
      .set('Content-Type', 'image/jpeg')
      .send(updatedData);
    // Make sure the fragment updated
    expect(putResponse.status).toBe(415);
  });

  test('Authorized users are able to update the fragment(image/jpeg)', async () => {
    const userEmail = 'user1@email.com';
    // Post a fragment
    const data = fs.readFileSync(`${absolutePath}/wallpaper.jpeg`);
    // Posting the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth(userEmail, 'ps1')
        .set('Content-Type', 'image/jpeg')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment,
      fragmentId = fragmentMetaData.id;
    // Make sure the fragment is stored
    const fragment = new Fragment(fragmentMetaData);
    expect(await fragment.getData()).toEqual(Buffer.from(data));
    // Update the fragment
    const updatedData = fs.readFileSync(`${absolutePath}/profile.jpeg`);
    const putResponse = await request(app)
      .put(`/v1/fragments/${fragmentId}`)
      .auth(userEmail, 'ps1')
      .set('Content-Type', 'image/jpeg')
      .send(updatedData);
    // Make sure the fragment updated
    expect(putResponse.status).toBe(201);
    expect(await fragment.getData()).toEqual(Buffer.from(updatedData));
  });
});
