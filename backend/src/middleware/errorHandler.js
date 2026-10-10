const AppError = require('../exceptions/AppError');
const { response } = require('../helpers');
const { app } = require('../config');

exports.notFound = (req, res, next) => next(AppError.notFound(`Route ${req.method} ${req.originalUrl} not found`));

// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  if (err instanceof AppError) return response.fail(res, err.statusCode, err.message, err.errors);

  if (err.name === 'TokenExpiredError') return response.fail(res, 401, 'Session expired, please login again');
  if (err.name === 'JsonWebTokenError') return response.fail(res, 401, 'Invalid token');

  if (err.name === 'SequelizeUniqueConstraintError') {
    const errors = {};
    err.errors.forEach((e) => { errors[e.path] = [`${e.path} already exists`]; });
    return response.fail(res, 409, 'Duplicate entry', errors);
  }
  if (err.name === 'SequelizeForeignKeyConstraintError') return response.fail(res, 422, 'Related record does not exist');

  if (err.type === 'entity.parse.failed') return response.fail(res, 400, 'Malformed JSON body');

  console.error(err);
  return response.fail(res, 500, app.env === 'production' ? 'Internal server error' : err.message);
};
