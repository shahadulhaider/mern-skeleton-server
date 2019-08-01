const HTTPStatus = require('http-status');

function notFound(req, res, next) {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(HTTPStatus.NOT_FOUND);
  next(error);
}

function errorHandler(err, req, res, next) {
  if (err && err.error && err.error.isJoi) {
    res.status(HTTPStatus.BAD_REQUEST).json({
      type: err.type,
      name: err.error,
      error: process.env.NODE_ENV === 'production' ? {} : err.error.details[0].message,
    });
  } else {
    next(err);
  }
}

module.exports = {
  notFound,
  errorHandler
};
