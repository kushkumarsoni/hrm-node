const AppError = require('../exceptions/AppError');

/** Usage: router.post('/', validate(createEmployeeRequest), handler) */
module.exports = (schema, source = 'body') => (req, res, next) => {
  const { error, value } = schema.validate(req[source], {
    abortEarly: false,
    stripUnknown: true,
    convert: true,
  });

  if (error) {
    const errors = {};
    error.details.forEach((d) => {
      const key = d.path.join('.') || 'value';
      (errors[key] = errors[key] || []).push(d.message.replace(/"/g, ''));
    });
    return next(AppError.validation(errors));
  }

  req[source] = value;
  next();
};
