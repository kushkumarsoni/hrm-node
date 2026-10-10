const { asyncHandler, response } = require('../helpers');
const AuthService = require('../services/AuthService');

exports.login = asyncHandler(async (req, res) => {
  const data = await AuthService.login(req.body.email, req.body.password);
  response.ok(res, data, 'Login successful');
});

exports.me = asyncHandler(async (req, res) => {
  response.ok(res, await AuthService.profile(req.user.id));
});

exports.changePassword = asyncHandler(async (req, res) => {
  await AuthService.changePassword(req.user.id, req.body.current_password, req.body.new_password);
  response.ok(res, null, 'Password changed successfully');
});
