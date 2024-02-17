// tests/unit/get.test.js

const request = require('supertest');
const app = require('../../src/app');
const Fragment = require('../../src/model/fragment');
const hash = require('../../src/hash');

describe('GET /v1/fragments', () => {
  // Making sure for all the unauthorized requests, the status code of 401 is sent!
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // Checking the credentials for all the authorized requests!
  test('incorrect credentials are denied', () =>
    // Sending an invalid email and password using the auth subfunction of request function!
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    // Storing the response of the get request along with passing true credentials!
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'ps1');
    // Making sure the status code of the response is correct!
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Okay!');
    // Making sure that the data of Array type is returned in the response!
    expect(Array.isArray(response.body.fragments)).toBe(true);
  });

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users gets an array of correct fragments id', async () => {
    // Create fragments
    const hashedOwnerId = hash('user1@email.com');
    const fragMetadata1 = new Fragment({ id: 'rdmId', ownerId: hashedOwnerId, type: 'text/plain' }),
      fragMetadata2 = new Fragment({ id: 'rdmId2', ownerId: hashedOwnerId, type: 'text/plain' });
    // Store the fragments for the authenticated user!
    fragMetadata1.save();
    fragMetadata2.save();
    // Request the fragments for the autheticated user!
    // Storing the response of the get request along with passing true credentials!
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'ps1');
    // Make sure the returned array is the same id as the stored ones!
    expect(response.body.fragments[0]).toBe('rdmId');
    expect(response.body.fragments[1]).toBe('rdmId2');
  });
});

describe('GET /v1/fragments/?expand=1', () => {
  test('Whole metadata is returned with expand query', async () => {
    // Storing the response of the get request along with passing true credentials!
    const response = await request(app)
      .get('/v1/fragments/?expand=1')
      .auth('user1@email.com', 'ps1');
  });
});
