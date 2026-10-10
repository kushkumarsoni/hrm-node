const router = require('express').Router();
const controller = require('../controllers/EmployeeController');
const authorize = require('../middleware/authorize');
const validate = require('../middleware/validate');
const { createEmployeeRequest, updateEmployeeRequest, listEmployeeQuery } = require('../requests/employee.request');

// Manager: own team (must be declared before "/:id")
router.get('/team', authorize('manager'), controller.team);

// Admin only
router.use(authorize('admin'));
router.get('/', validate(listEmployeeQuery, 'query'), controller.index);
router.post('/', validate(createEmployeeRequest), controller.store);
router.get('/:id', controller.show);
router.put('/:id', validate(updateEmployeeRequest), controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
