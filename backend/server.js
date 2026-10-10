require('dotenv').config();

const app = require('./src/app');
const config = require('./src/config');
const db = require('./src/models');

const start = async () => {
  try {
    await db.sequelize.authenticate();
    console.log('✔ Database connected');

    app.listen(config.app.port, () => {
      console.log(`✔ ${config.app.name} API running on http://localhost:${config.app.port}/api/v1`);
    });
  } catch (err) {
    console.error('✖ Unable to start server:', err.message);
    process.exit(1);
  }
};

start();
