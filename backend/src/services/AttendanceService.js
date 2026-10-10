const { Op } = require('sequelize');
const AppError = require('../exceptions/AppError');
const { date, pagination } = require('../helpers');
const { Attendance, User } = require('../models');
const EmployeeService = require('./EmployeeService');

const HALF_DAY_MINUTES = 240;

class AttendanceService {
  static async checkIn(userId) {
    const today = date.today();
    const existing = await Attendance.findOne({ where: { user_id: userId, date: today } });
    if (existing) throw AppError.conflict('You have already checked in today');

    return Attendance.create({ user_id: userId, date: today, check_in: new Date() });
  }

  static async checkOut(userId) {
    const record = await Attendance.findOne({ where: { user_id: userId, date: date.today() } });

    if (!record) throw AppError.badRequest('You have not checked in today');
    if (record.check_out) throw AppError.conflict('You have already checked out today');

    const now = new Date();
    const minutes = date.diffInMinutes(record.check_in, now);

    await record.update({
      check_out: now,
      work_minutes: minutes,
      status: minutes >= HALF_DAY_MINUTES ? 'present' : 'half_day',
    });
    return record;
  }

  static today(userId) {
    return Attendance.findOne({ where: { user_id: userId, date: date.today() } });
  }

  static mine(userId, query) {
    const { start, end } = date.monthRange(query.month);
    return Attendance.findAll({
      where: { user_id: userId, date: { [Op.between]: [start, end] } },
      order: [['date', 'DESC']],
    });
  }

  /** Admin sees everyone, manager sees only direct reports. */
  static async team(actor, query) {
    const { page, limit, offset } = pagination.getPagination(query);
    const where = { date: query.date || date.today() };

    if (actor.role === 'manager') where.user_id = { [Op.in]: await EmployeeService.teamIds(actor.id) };

    const { rows, count } = await Attendance.findAndCountAll({
      where,
      include: [{ model: User, as: 'user', attributes: ['id', 'name', 'employee_code', 'designation'] }],
      limit, offset, order: [['check_in', 'ASC']],
    });

    return { rows, meta: pagination.buildMeta(count, page, limit) };
  }
}

module.exports = AttendanceService;
