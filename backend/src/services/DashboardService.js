const { Op } = require('sequelize');
const { date } = require('../helpers');
const { User, Department, Attendance, Leave } = require('../models');
const EmployeeService = require('./EmployeeService');

class DashboardService {
  static summary(user) {
    if (user.role === 'admin') return this.admin();
    if (user.role === 'manager') return this.manager(user);
    return this.employee(user);
  }

  static async admin() {
    const today = date.today();
    const [totalEmployees, activeEmployees, departments, presentToday, pendingLeaves, onLeaveToday] = await Promise.all([
      User.count(),
      User.count({ where: { status: 'active' } }),
      Department.count(),
      Attendance.count({ where: { date: today } }),
      Leave.count({ where: { status: 'pending' } }),
      Leave.count({ where: { status: 'approved', from_date: { [Op.lte]: today }, to_date: { [Op.gte]: today } } }),
    ]);
    return { totalEmployees, activeEmployees, departments, presentToday, pendingLeaves, onLeaveToday };
  }

  static async manager(user) {
    const today = date.today();
    const ids = await EmployeeService.teamIds(user.id);
    const [presentToday, pendingLeaves, onLeaveToday] = await Promise.all([
      Attendance.count({ where: { user_id: { [Op.in]: ids }, date: today } }),
      Leave.count({ where: { user_id: { [Op.in]: ids }, status: 'pending' } }),
      Leave.count({ where: { user_id: { [Op.in]: ids }, status: 'approved', from_date: { [Op.lte]: today }, to_date: { [Op.gte]: today } } }),
    ]);
    return { teamSize: ids.length, presentToday, pendingLeaves, onLeaveToday };
  }

  static async employee(user) {
    const today = date.today();
    const year = today.slice(0, 4);
    const [todayRecord, pendingLeaves, approvedDays, presentThisMonth] = await Promise.all([
      Attendance.findOne({ where: { user_id: user.id, date: today } }),
      Leave.count({ where: { user_id: user.id, status: 'pending' } }),
      Leave.sum('days', { where: { user_id: user.id, status: 'approved', from_date: { [Op.gte]: `${year}-01-01` } } }),
      Attendance.count({ where: { user_id: user.id, date: { [Op.between]: [`${today.slice(0, 7)}-01`, today] } } }),
    ]);
    return {
      checkedIn: !!todayRecord,
      checkedOut: !!(todayRecord && todayRecord.check_out),
      pendingLeaves,
      approvedLeaveDaysThisYear: approvedDays || 0,
      presentThisMonth,
    };
  }
}

module.exports = DashboardService;
