const Joi = require('joi');

exports.attendanceQuery = Joi.object({
  month: Joi.string().pattern(/^\d{4}-\d{2}$/).messages({ 'string.pattern.base': 'month must be YYYY-MM' }),
  date: Joi.date().iso(),
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
});
