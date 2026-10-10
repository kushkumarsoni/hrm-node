const AppError = require('../exceptions/AppError');

/** Usage: router.get('/', authorize('admin', 'manager'), handler) */
module.exports = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return next(AppError.forbidden());
  next();
};
