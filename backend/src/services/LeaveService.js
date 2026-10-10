const { Op } = require('sequelize');
const AppError = require('../exceptions/AppError');
const { date, pagination } = require('../helpers');
const { Leave, User } = require('../models');
const EmployeeService = require('./EmployeeService');

const withUser = [
  { model: User, as: 'user', attributes: ['id', 'name', 'employee_code', 'designation', 'manager_id'] },
  { model: User, as: 'reviewer', attributes: ['id', 'name'] },
];

class LeaveService {
  static async apply(user, data) {
    const from = String(data.from_date).slice(0, 10);
    const to = String(data.to_date).slice(0, 10);

    const overlap = await Leave.findOne({
      where: {
        user_id: user.id,
        status: { [Op.in]: ['pending', 'approved'] },
        from_date: { [Op.lte]: to },
        to_date: { [Op.gte]: from },
      },
    });
    if (overlap) throw AppError.conflict('You already have a leave request for these dates');

    return Leave.create({
      user_id: user.id,
      type: data.type,
      reason: data.reason,
      from_date: from,
      to_date: to,
      days: date.daysBetween(from, to),
    });
  }

  static async mine(userId, query) {
    const { page, limit, offset } = pagination.getPagination(query);
    const where = { user_id: userId };
    if (query.status) where.status = query.status;

    const { rows, count } = await Leave.findAndCountAll({
      where, include: withUser, limit, offset, order: [['id', 'DESC']],
    });
    return { rows, meta: pagination.buildMeta(count, page, limit) };
  }

  /** Leave requests the actor is allowed to review (admin: all, manager: direct reports). */
  static async reviewable(actor, query) {
    const { page, limit, offset } = pagination.getPagination(query);
    const where = {};
    if (query.status) where.status = query.status;

    if (actor.role === 'manager') {
      where.user_id = { [Op.in]: await EmployeeService.teamIds(actor.id) };
    } else {
      where.user_id = { [Op.ne]: actor.id }; // admin does not review own leave here
    }

    const { rows, count } = await Leave.findAndCountAll({
      where, include: withUser, limit, offset, order: [['status', 'ASC'], ['id', 'DESC']],
    });
    return { rows, meta: pagination.buildMeta(count, page, limit) };
  }

  static async review(actor, id, { status, note }) {
    const leave = await Leave.findByPk(id, { include: withUser });
    if (!leave) throw AppError.notFound('Leave request not found');

    if (leave.user_id === actor.id) throw AppError.forbidden('You cannot review your own leave');
    if (actor.role === 'manager' && leave.user.manager_id !== actor.id) {
      throw AppError.forbidden('This employee is not in your team');
    }
    if (leave.status !== 'pending') throw AppError.conflict(`Leave is already ${leave.status}`);

    await leave.update({
      status,
      review_note: note || null,
      reviewed_by: actor.id,
      reviewed_at: new Date(),
    });
    return leave.reload();
  }

  static async cancel(user, id) {
    const leave = await Leave.findOne({ where: { id, user_id: user.id } });
    if (!leave) throw AppError.notFound('Leave request not found');
    if (leave.status !== 'pending') throw AppError.conflict('Only pending requests can be cancelled');
    await leave.destroy();
  }
}

module.exports = LeaveService;
