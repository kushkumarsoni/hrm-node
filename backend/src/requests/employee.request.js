const Joi = require('joi');
const { roles } = require('../config');

const shared = {
  name: Joi.string().trim().min(2).max(120),
  email: Joi.string().trim().lowercase().email(),
  role: Joi.string().valid(...roles.all),
  phone: Joi.string().trim().max(20).allow('', null),
  designation: Joi.string().trim().max(100).allow('', null),
  joining_date: Joi.date().iso().allow(null),
  department_id: Joi.number().integer().positive().allow(null),
  manager_id: Joi.number().integer().positive().allow(null),
  status: Joi.string().valid('active', 'inactive'),
};

exports.createEmployeeRequest = Joi.object({
  ...shared,
  name: shared.name.required(),
  email: shared.email.required(),
  password: Joi.string().min(8).max(64).required(),
  role: shared.role.default('employee'),
});

exports.updateEmployeeRequest = Joi.object({
  ...shared,
  password: Joi.string().min(8).max(64),
}).min(1);

exports.listEmployeeQuery = Joi.object({
  page: Joi.number().integer().min(1),
  limit: Joi.number().integer().min(1).max(100),
  search: Joi.string().trim().allow(''),
  role: shared.role,
  status: shared.status,
  department_id: Joi.number().integer().positive(),
});

exports.createDepartmentRequest = Joi.object({
  name: Joi.string().trim().min(2).max(100).required(),
  description: Joi.string().trim().max(255).allow('', null),
});
