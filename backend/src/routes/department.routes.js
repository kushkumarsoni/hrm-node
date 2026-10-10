const router = require('express').Router();
const controller = require('../controllers/EmployeeController');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createDepartmentRequest } = require('../requests/employee.request');

router.get('/', authorize('admin', 'manager'), controller.departments);
router.post('/', authorize('admin'), validate(createDepartmentRequest), controller.storeDepartment);

module.exports = router;
