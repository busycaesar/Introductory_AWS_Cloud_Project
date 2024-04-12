// test/unit/post.test.js

const request = require('supertest');
const fs = require('fs');
const absolutePath = 'tests/unit/sampleFile';

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
});

describe('POST /Fragments in various types', () => {
  test('authorized users are not able to store the fragments in any unsupported type', async () => {
    // Trying to store unsupported type of fragment content!
    const response = await request(app)
      .post('/v1/fragments')
      .auth('user1@email.com', 'ps1')
      .set('Content-Type', 'text/cpp')
      .send('This is unsupported data format!');
    // Making sure it results in an error!
    expect(response.status).toBe(415);
    expect(response.body.status).toBe('Error!');
  });

  // Making sure that the users are able to stored the data in fragments!
  test('authorized users are able to store the fragments of text/plain type!', async () => {
    const data = 'This is first fragment data!';
    // Posting the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/plain')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetching the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe(data);
  });

  test('authorized users are able to store the fragments of text/markdown type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/sample.md`, 'utf-8');
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/markdown')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata!
    // Convert the data received to string becuase by default it is stored as buffer.
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe(data);
  });

  test('authorized users are able to store the fragments of text/html type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/sample.html`, 'utf-8');
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/html')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe(data);
  });

  test('authorized users are able to store the fragments of text/csv type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/sample.csv`, 'utf-8');
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'text/csv')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe(data);
  });

  test('authorized users are able to store the fragments of application/json type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/sample.json`, 'utf-8');
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'application/json')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = (await new Fragment(fragmentMetaData).getData()).toString('utf-8');
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toBe(data);
  });

  test('authorized users are able to store the fragments of image/jpeg type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/profile.jpeg`);
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'image/jpeg')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = await new Fragment(fragmentMetaData).getData();
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toEqual(Buffer.from(data));
  });

  test('authorized users are able to store the fragments of image/gif type!', async () => {
    // Create a text/markdown type data!
    const data = fs.readFileSync(`${absolutePath}/sponge.gif`);
    // Post the data along with credentials and supported data type!
    const response = await request(app)
        .post('/v1/fragments')
        .auth('user1@email.com', 'ps1')
        .set('Content-Type', 'image/gif')
        .send(data),
      // Getting the metadata from of the data posted!
      fragmentMetaData = response.body.fragment;
    // Making sure that the response returned a proper status code!
    expect(response.status).toBe(201);
    expect(response.body.status).toBe('Okay!');
    // Fetch the data from the database using the metadata received upon making the post request!
    const _storedFragmentData = await new Fragment(fragmentMetaData).getData();
    // Making sure that the post API actually stored the data!
    expect(_storedFragmentData).toEqual(Buffer.from(data));
  });
});
