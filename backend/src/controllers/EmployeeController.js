const { asyncHandler, response } = require('../helpers');
const EmployeeService = require('../services/EmployeeService');

exports.index = asyncHandler(async (req, res) => {
  const { rows, meta } = await EmployeeService.list(req.query);
  response.paginated(res, rows, meta);
});

exports.team = asyncHandler(async (req, res) => {
  const { rows, meta } = await EmployeeService.team(req.user.id, req.query);
  response.paginated(res, rows, meta);
});

exports.show = asyncHandler(async (req, res) => {
  response.ok(res, await EmployeeService.find(req.params.id));
});

exports.store = asyncHandler(async (req, res) => {
  response.created(res, await EmployeeService.create(req.body), 'Employee created successfully');
});

exports.update = asyncHandler(async (req, res) => {
  response.ok(res, await EmployeeService.update(req.params.id, req.body, req.user), 'Employee updated successfully');
});

exports.destroy = asyncHandler(async (req, res) => {
  await EmployeeService.deactivate(req.params.id, req.user);
  response.ok(res, null, 'Employee deactivated');
});

// Departments
exports.departments = asyncHandler(async (req, res) => response.ok(res, await EmployeeService.departments()));

exports.storeDepartment = asyncHandler(async (req, res) => {
  response.created(res, await EmployeeService.createDepartment(req.body), 'Department created');
});
