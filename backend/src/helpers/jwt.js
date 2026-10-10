const jwt = require('jsonwebtoken');
const { auth } = require('../config');

exports.signToken = (user) =>
  jwt.sign({ sub: user.id, role: user.role }, auth.jwt.secret, { expiresIn: auth.jwt.expiresIn });

exports.verifyToken = (token) => jwt.verify(token, auth.jwt.secret);
