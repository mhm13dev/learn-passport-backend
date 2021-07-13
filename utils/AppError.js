class AppError extends Error {
  constructor(
    message = 'Something Went Wrong',
    status = 'error',
    statusCode = 500
  ) {
    super(message);
    this.status = status;
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
