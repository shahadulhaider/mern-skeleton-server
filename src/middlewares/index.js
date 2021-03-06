/* eslint-disable no-param-reassign */
const HTTPStatus = require('http-status');
const { isCelebrate } = require('celebrate');
const ApiError = require('../helpers/apiError');

function notFound(req, res, next) {
  const err = new ApiError(
    HTTPStatus.NOT_FOUND,
    HTTPStatus[HTTPStatus.NOT_FOUND],
    `Not Found - ${req.originalUrl}`,
  );
  next(err);
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  console.log(JSON.parse(JSON.stringify(err)));
  console.log(err.constructor.name);

  err.statusCode = err.statusCode || HTTPStatus.BAD_REQUEST;
  err.status = err.status || HTTPStatus[HTTPStatus.BAD_REQUEST];
  err.detail = err.message;

  if (err.name === 'AuthenticationError') {
    const { authError } = req;

    err.statusCode = HTTPStatus.UNAUTHORIZED;
    err.status = HTTPStatus[HTTPStatus.UNAUTHORIZED];

    switch (authError) {
      case 'UserNotFound':
        err.message = 'No user with given credentials';
        break;
      case 'WrongCredentials':
        err.message = 'Wrong email or password';
        break;
      default:
        err.message = 'Unauthorized';
    }
  }

  if (err.constructor.name === 'MongooseError') {
    const { errors } = err;

    const detail = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(errors)) {
      detail[`${key}`] = { message: `${value}` };
    }
    err.detail = detail;

    delete err.errors;
    delete err._message;
  }

  if (isCelebrate(err)) {
    const { details } = err.joi;
    const detail = {};

    details.forEach(e => {
      detail[`${e.path}`] = { message: e.message };
      if (e.context.key === 'password') {
        detail.password = {
          message:
            'Password is required. Must have at least 8 characters including numbers, lowercase and uppercase letters',
        };
        err.message =
          'Password is required. Must have at least 8 characters including numbers, lowercase and uppercase letters';
      }
    });

    err.detail = detail;
    delete err.joi;
    delete err.meta;
  }

  return res.status(err.statusCode).json({
    statusCode: err.statusCode,
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

module.exports = {
  notFound,
  errorHandler,
};
