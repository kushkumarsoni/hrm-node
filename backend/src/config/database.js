require('dotenv').config();

const base = {
  username: process.env.DB_USER,
  password: process.env.DB_PASS || null,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST || '127.0.0.1',
  port: Number(process.env.DB_PORT) || 3306,
  dialect: 'mysql',
  timezone: '+05:30',
  logging: false,
  define: { underscored: true, timestamps: true },
};

// sequelize-cli reads these environment keys
module.exports = {
  development: base,
  test: base,
  production: { ...base, pool: { max: 10, min: 0, idle: 10000 } },
};
