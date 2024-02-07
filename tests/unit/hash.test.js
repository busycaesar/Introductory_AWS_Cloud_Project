const hash = require('../../src/hash');

describe('hash()', () => {
  // Declaring a dummy email address for testing purpose!
  const email = 'user1@example.com';

  test('email addresses should get hashed using sha256 to hex strings', () => {
    // This is the hashed value of the above declared email address!
    const hashedEmail = 'b36a83701f1c3191e19722d6f90274bc1b5501fe69ebf33313e440fe4b0fe210';
    // Making sure that the function returns the same value!
    expect(hash(email)).toEqual(hashedEmail);
  });

  // Making sure that everytime the hash function returns the same value for the email!
  test('hashing should always return the same value for a given string', () => {
    const email = 'user1@example.com';
    expect(hash(email)).toEqual(hash(email));
  });
});
