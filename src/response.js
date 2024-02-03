// src/response.js

// This file has function which can be used to sent the response. This functions are helpful because it contains all the required const data to be sent in both the cases: Error and Success!

module.exports.createSuccessResponse = (data) => {
  return {
    status: 'Okay!',
    ...data,
  };
};

module.exports.createErrorResponse = (code, message) => {
  return {
    status: 'Error!',
    error: {
      code: code,
      message: message,
    },
  };
};
