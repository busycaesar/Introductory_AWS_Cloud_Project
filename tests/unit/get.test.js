// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // Making sure for all the unauthorized requests, the status code of 401 is sent!
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // Checking the credentials for all the authorized requests!
  test('incorrect credentials are denied', () =>
    // Sending an invalid email and password using the auth subfunction of request function!
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const response = await request(app).get('/v1/fragments').auth('user1@email.com', 'ps1');
    expect(response.statusCode).toBe(200);
    expect(response.body.status).toBe('Okay!');
    // Making sure that the data of Array type is returned in the response!
    expect(Array.isArray(response.body.fragments)).toBe(true);
  });
});
