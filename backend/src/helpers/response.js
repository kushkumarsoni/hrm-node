const send = (res, statusCode, success, message, data = null, extra = {}) =>
  res.status(statusCode).json({ success, message, data, ...extra });

exports.ok = (res, data = null, message = 'Success') => send(res, 200, true, message, data);
exports.created = (res, data = null, message = 'Created successfully') => send(res, 201, true, message, data);
exports.paginated = (res, rows, meta, message = 'Success') => send(res, 200, true, message, rows, { meta });
exports.fail = (res, statusCode, message, errors = null) => send(res, statusCode, false, message, null, errors ? { errors } : {});
