class ApiError extends Error {
  constructor(statusCode, status, message, detail = null) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    this.message = message;
    this.detail = detail;
  }
}

module.exports = ApiError;
