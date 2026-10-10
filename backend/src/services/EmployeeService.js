const { Op } = require('sequelize');
const AppError = require('../exceptions/AppError');
const { pagination } = require('../helpers');
const { User, Department } = require('../models');

const withRelations = [
  { model: Department, as: 'department', attributes: ['id', 'name'] },
  { model: User, as: 'manager', attributes: ['id', 'name'] },
];

class EmployeeService {
  static async list(query) {
    const { page, limit, offset } = pagination.getPagination(query);
    const where = {};

    if (query.role) where.role = query.role;
    if (query.status) where.status = query.status;
    if (query.department_id) where.department_id = query.department_id;
    if (query.search) {
      const like = `%${query.search}%`;
      where[Op.or] = [{ name: { [Op.like]: like } }, { email: { [Op.like]: like } }, { employee_code: { [Op.like]: like } }];
    }

    const { rows, count } = await User.findAndCountAll({
      where, include: withRelations, limit, offset, order: [['id', 'DESC']], distinct: true,
    });

    return { rows, meta: pagination.buildMeta(count, page, limit) };
  }

  static async find(id) {
    const user = await User.findByPk(id, { include: withRelations });
    if (!user) throw AppError.notFound('Employee not found');
    return user;
  }

  static async create(data) {
    await this.assertManager(data.manager_id);

    const user = await User.create(data);
    user.employee_code = `EMP${String(user.id).padStart(4, '0')}`;
    await user.save();

    return this.find(user.id);
  }

  static async update(id, data, actor) {
    const user = await this.find(id);

    if (data.manager_id !== undefined) {
      if (Number(data.manager_id) === Number(id)) throw AppError.validation({ manager_id: ['Employee cannot be their own manager'] });
      await this.assertManager(data.manager_id);
    }
    if (Number(id) === actor.id && (data.status === 'inactive' || (data.role && data.role !== actor.role))) {
      throw AppError.badRequest('You cannot deactivate or change the role of your own account');
    }

    await user.update(data);
    return this.find(id);
  }

  /** Soft removal: account is kept for attendance/leave history but cannot log in. */
  static async deactivate(id, actor) {
    if (Number(id) === actor.id) throw AppError.badRequest('You cannot deactivate your own account');
    const user = await this.find(id);
    await user.update({ status: 'inactive' });
  }

  static async team(managerId, query = {}) {
    const { page, limit, offset } = pagination.getPagination(query);
    const { rows, count } = await User.findAndCountAll({
      where: { manager_id: managerId }, include: withRelations, limit, offset, order: [['name', 'ASC']],
    });
    return { rows, meta: pagination.buildMeta(count, page, limit) };
  }

  static async teamIds(managerId) {
    const members = await User.findAll({ where: { manager_id: managerId }, attributes: ['id'] });
    return members.map((m) => m.id);
  }

  static async assertManager(managerId) {
    if (!managerId) return;
    const manager = await User.findByPk(managerId);
    if (!manager || !['manager', 'admin'].includes(manager.role)) {
      throw AppError.validation({ manager_id: ['Selected manager is invalid'] });
    }
  }

  // ---- Departments ----
  static departments() {
    return Department.findAll({ order: [['name', 'ASC']] });
  }

  static createDepartment(data) {
    return Department.create(data);
  }
}

module.exports = EmployeeService;
