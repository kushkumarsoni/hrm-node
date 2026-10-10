module.exports = {
  name: process.env.APP_NAME || 'HRM',
  env: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  timezone: process.env.APP_TIMEZONE || 'Asia/Kolkata',
};
