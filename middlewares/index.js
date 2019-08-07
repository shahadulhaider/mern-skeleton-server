const HTTPStatus = require('http-status');

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HTTPStatus.NOT_FOUND);
  next(error);
}

function errorHandler(err, req, res, next) {
  if (err && err.error && err.error.isJoi) {
    const { details } = err.error;
    const errors = {};

    details.forEach(e => (errors[`${e.path}`] = { message: e.message }));

    if (errors.hasOwnProperty('password')) {
      errors.password = {
        message:
          'Password should be at least 8 characters long containing both numbers and letters.',
      };
    }
    res.status(HTTPStatus.BAD_REQUEST).json({ errors });
  } else {
    next(err);
  }
}

module.exports = {
  notFound,
  errorHandler,
};
