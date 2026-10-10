const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const controller = require('../controllers/AuthController');
const authenticate = require('../middleware/authenticate');
const validate = require('../middleware/validate');
const { loginRequest, changePasswordRequest } = require('../requests/auth.request');

const loginLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { success: false, message: 'Too many login attempts, try again later' } });

router.post('/login', loginLimiter, validate(loginRequest), controller.login);
router.get('/me', authenticate, controller.me);
router.post('/change-password', authenticate, validate(changePasswordRequest), controller.changePassword);

module.exports = router;
