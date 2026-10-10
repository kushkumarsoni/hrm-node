const Joi = require('joi');

exports.applyLeaveRequest = Joi.object({
  type: Joi.string().valid('casual', 'sick', 'paid').required(),
  from_date: Joi.date().iso().required(),
  to_date: Joi.date().iso().min(Joi.ref('from_date')).required(),
  reason: Joi.string().trim().min(3).max(500).required(),
});

exports.reviewLeaveRequest = Joi.object({
  status: Joi.string().valid('approved', 'rejected').required(),
  note: Joi.string().trim().max(255).allow('', null),
});

exports.listLeaveQuery = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  status: Joi.string().valid('pending', 'approved', 'rejected'),
});
