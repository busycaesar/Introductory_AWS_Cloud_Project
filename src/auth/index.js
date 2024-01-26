// src/auth/index.js

// Exporting amazon cognito
if(process.env.AWS_COGNITO_POOL_ID && process.env.AWS_COGNITO_CLIENT_ID){
	module.exports = require("./cognito");
}
// Making sure to export the basic authentication only in case that the project is not in production!
else if(process.env.HTPASSWD_FILE && process.NODE_ENV != "production"){
	module.exports = require("./basic-auth");
}
else throw new Error("Missing env variables: No authorization configuration found!");
