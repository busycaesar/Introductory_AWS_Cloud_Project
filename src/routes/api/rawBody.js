// src/routes/api/rawBody.js

const express = require('express');
const contentType = require('content-type');
const Fragment = require('../../model/fragment');

module.exports =
  /**
   * This is a middleware function which have several checks for the received data through request's body.
   * The major check is making sure that the type of the data in the request's body is one of the supported type or not.
   * First it will make sure that the content type mentioned in the request's header, is one of the supported type using the Fragment object's isSupportedType method.
   * If it would be a supported type, the express would parse the raw binary data from the request body, otherwise, if the content type mentioned is not one of the supported type, the express would put an empty object in the request's body!
   */
  () =>
    express.raw({
      inflate: true,
      limit: '5mb',
      type: (req) => {
        const { type } = contentType.parse(req);
        return Fragment.isSupportedType(type);
      },
    });
