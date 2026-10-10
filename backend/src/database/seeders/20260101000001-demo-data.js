const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const now = new Date();
    const password = await bcrypt.hash('Password@123', 10);

    await queryInterface.bulkInsert('departments', [
      { name: 'Engineering', description: 'Software development', created_at: now, updated_at: now },
      { name: 'Human Resources', description: 'People operations', created_at: now, updated_at: now },
      { name: 'Sales', description: 'Sales & marketing', created_at: now, updated_at: now },
    ]);

    // Admin and manager first so employees can reference the manager
    await queryInterface.bulkInsert('users', [
      { employee_code: 'EMP0001', name: 'Super Admin', email: 'admin@hrm.test', password, role: 'admin', designation: 'HR Head', department_id: 2, joining_date: '2024-01-01', status: 'active', created_at: now, updated_at: now },
      { employee_code: 'EMP0002', name: 'Rahul Manager', email: 'manager@hrm.test', password, role: 'manager', designation: 'Team Lead', department_id: 1, joining_date: '2024-02-01', status: 'active', created_at: now, updated_at: now },
    ]);

    await queryInterface.bulkInsert('users', [
      { employee_code: 'EMP0003', name: 'Amit Employee', email: 'employee@hrm.test', password, role: 'employee', designation: 'Software Developer', department_id: 1, manager_id: 2, joining_date: '2024-03-01', status: 'active', created_at: now, updated_at: now },
      { employee_code: 'EMP0004', name: 'Neha Sharma', email: 'neha@hrm.test', password, role: 'employee', designation: 'QA Engineer', department_id: 1, manager_id: 2, joining_date: '2024-04-01', status: 'active', created_at: now, updated_at: now },
    ]);
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('departments', null, {});
  },
};
