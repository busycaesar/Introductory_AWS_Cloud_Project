// src/auth.js

// Configuring the strategy for Passport to parse the token from the Authorization header provided by Cognito!

const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;
const { CognitoJwtVerifier } = require('aws-jwt-verify');

const logger = require('./logger');

// This file expects AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID to be already defined!
if(!(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID)){
	throw new Error("Missing the expected environmental variables: AWS_COGNITO_POOL_ID and AWS_COGNITO_CLIENT_ID");
}

// Creating a JWT verifier which can confirm that the JWT received from the user is valid.
const jwtVerifier = CognitoJwtVerifier.create({
  // Fetching the Cognito credentials from .env
  userPoolId: process.env.AWS_COGNITO_POOL_ID,
  clientId: process.env.AWS_COGNITO_CLIENT_ID,
  // To verify, we expect the identity token
  tokenUse: 'id',
});

logger.info('Configured to use AWS Cognito for Authorization!');

// Calling the hydrate method of the object. The method will download and cache(so that we dont have to download it whenever a user is being authorize) the JWKs from the cognito using the credentials provided above. This JWKs will help in authorizing the JWT received in the header from the Cognito.
jwtVerifier
  .hydrate()
  .then(() => {
    logger.info('Cognito JWKS successfully cached!');
  })
  .catch((error) => {
    logger.error({ error }, 'Unable to cache Cognito JWKs!');
  });

module.exports.strategy = () =>
  new BearerStrategy(async (token, done) => {
    try {
      // Calling the verify method of the object to verify the token received!
      const user = await jwtVerifier.verify(token);
      logger.debug({ user }, 'Verified user token!');

      done(null, user.email);
    } catch (error) {
      logger.error({ error, token }, 'Could not verify the token!');
      done(null, false);
    }
  });

module.exports.authenticate = () => passport.authenticate('bearer', { session: false });
