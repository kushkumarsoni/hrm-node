const { asyncHandler, response } = require('../helpers');
const LeaveService = require('../services/LeaveService');

exports.apply = asyncHandler(async (req, res) => {
  response.created(res, await LeaveService.apply(req.user, req.body), 'Leave request submitted');
});

exports.mine = asyncHandler(async (req, res) => {
  const { rows, meta } = await LeaveService.mine(req.user.id, req.query);
  response.paginated(res, rows, meta);
});

exports.requests = asyncHandler(async (req, res) => {
  const { rows, meta } = await LeaveService.reviewable(req.user, req.query);
  response.paginated(res, rows, meta);
});

exports.review = asyncHandler(async (req, res) => {
  const leave = await LeaveService.review(req.user, req.params.id, req.body);
  response.ok(res, leave, `Leave ${leave.status}`);
});

exports.cancel = asyncHandler(async (req, res) => {
  await LeaveService.cancel(req.user, req.params.id);
  response.ok(res, null, 'Leave request cancelled');
});
