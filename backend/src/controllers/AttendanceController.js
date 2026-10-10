const { asyncHandler, response } = require('../helpers');
const AttendanceService = require('../services/AttendanceService');

exports.checkIn = asyncHandler(async (req, res) => {
  response.created(res, await AttendanceService.checkIn(req.user.id), 'Checked in successfully');
});

exports.checkOut = asyncHandler(async (req, res) => {
  response.ok(res, await AttendanceService.checkOut(req.user.id), 'Checked out successfully');
});

exports.today = asyncHandler(async (req, res) => {
  response.ok(res, await AttendanceService.today(req.user.id));
});

exports.mine = asyncHandler(async (req, res) => {
  response.ok(res, await AttendanceService.mine(req.user.id, req.query));
});

exports.team = asyncHandler(async (req, res) => {
  const { rows, meta } = await AttendanceService.team(req.user, req.query);
  response.paginated(res, rows, meta);
});
