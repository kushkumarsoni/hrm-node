const AppError = require('../exceptions/AppError');
const { asyncHandler, jwt } = require('../helpers');
const { User } = require('../models');

module.exports = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) throw AppError.unauthorized('Token missing');

  const payload = jwt.verifyToken(token); // JWT errors are mapped in errorHandler
  const user = await User.findByPk(payload.sub);

  if (!user || user.status !== 'active') throw AppError.unauthorized('Account not found or inactive');

  req.user = user;
  next();
});
