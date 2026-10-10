const { asyncHandler, response } = require('../helpers');
const DashboardService = require('../services/DashboardService');

exports.index = asyncHandler(async (req, res) => {
  response.ok(res, await DashboardService.summary(req.user));
});
