// src/response.js

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
