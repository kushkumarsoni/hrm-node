class AppError extends Error {
  constructor(message, statusCode = 400, errors = null) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errors = errors;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = 'Bad request') { return new AppError(msg, 400); }
  static unauthorized(msg = 'Unauthenticated') { return new AppError(msg, 401); }
  static forbidden(msg = 'You do not have permission to perform this action') { return new AppError(msg, 403); }
  static notFound(msg = 'Resource not found') { return new AppError(msg, 404); }
  static conflict(msg = 'Conflict') { return new AppError(msg, 409); }
  static validation(errors, msg = 'Validation failed') { return new AppError(msg, 422, errors); }
}

module.exports = AppError;
