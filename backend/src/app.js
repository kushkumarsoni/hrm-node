const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const config = require('./config');
const routes = require('./routes');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();

app.use(helmet());
app.use(cors(config.cors));
app.use(express.json({ limit: '1mb' }));
if (config.app.env !== 'test') app.use(morgan('dev'));

app.use('/api/v1', rateLimit({ windowMs: 15 * 60 * 1000, max: 1000 }), routes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
