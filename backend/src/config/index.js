module.exports = {
  app: require('./app'),
  auth: require('./auth'),
  roles: require('./roles'),
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
    credentials: true,
  },
};
