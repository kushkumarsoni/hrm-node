const router = require('express').Router();
const controller = require('../controllers/AttendanceController');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { attendanceQuery } = require('../requests/attendance.request');

router.post('/check-in', controller.checkIn);
router.post('/check-out', controller.checkOut);
router.get('/today', controller.today);
router.get('/me', validate(attendanceQuery, 'query'), controller.mine);
router.get('/team', authorize('admin', 'manager'), validate(attendanceQuery, 'query'), controller.team);

module.exports = router;
