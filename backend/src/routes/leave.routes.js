const router = require('express').Router();
const controller = require('../controllers/LeaveController');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { applyLeaveRequest, reviewLeaveRequest, listLeaveQuery } = require('../requests/leave.request');

router.post('/', validate(applyLeaveRequest), controller.apply);
router.get('/me', validate(listLeaveQuery, 'query'), controller.mine);
router.delete('/:id', controller.cancel);

router.get('/requests', authorize('admin', 'manager'), validate(listLeaveQuery, 'query'), controller.requests);
router.patch('/:id/review', authorize('admin', 'manager'), validate(reviewLeaveRequest), controller.review);

module.exports = router;
