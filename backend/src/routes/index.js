const router = require('express').Router();
const authenticate = require('../middleware/authenticate');

router.get('/health', (req, res) => res.json({ success: true, message: 'API is running' }));

router.use('/auth', require('./auth.routes'));

// Everything below needs a valid JWT
router.use(authenticate);
router.use('/dashboard', require('./dashboard.routes'));
router.use('/employees', require('./employee.routes'));
router.use('/departments', require('./department.routes'));
router.use('/attendance', require('./attendance.routes'));
router.use('/leaves', require('./leave.routes'));

module.exports = router;
