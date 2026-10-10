const Joi = require('joi');

exports.loginRequest = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

exports.changePasswordRequest = Joi.object({
  current_password: Joi.string().required(),
  new_password: Joi.string().min(8).max(64).required(),
  confirm_password: Joi.any().valid(Joi.ref('new_password')).required().messages({ 'any.only': 'confirm_password must match new_password' }),
});
