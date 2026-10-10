const bcrypt = require('bcryptjs');
const { auth } = require('../config');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    employee_code: { type: DataTypes.STRING(20), unique: true },
    name: { type: DataTypes.STRING(120), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true, validate: { isEmail: true } },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'manager', 'employee'), allowNull: false, defaultValue: 'employee' },
    phone: { type: DataTypes.STRING(20) },
    designation: { type: DataTypes.STRING(100) },
    joining_date: { type: DataTypes.DATEONLY },
    status: { type: DataTypes.ENUM('active', 'inactive'), allowNull: false, defaultValue: 'active' },
    department_id: { type: DataTypes.INTEGER },
    manager_id: { type: DataTypes.INTEGER },
  }, {
    tableName: 'users',
    underscored: true,
    // password never leaks in responses; use User.unscoped() when you need it (login)
    defaultScope: { attributes: { exclude: ['password'] } },
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) user.password = await bcrypt.hash(user.password, auth.bcryptRounds);
      },
    },
  });

  User.prototype.comparePassword = function comparePassword(plain) {
    return bcrypt.compare(plain, this.password);
  };

  User.associate = (db) => {
    User.belongsTo(db.Department, { foreignKey: 'department_id', as: 'department' });
    User.belongsTo(db.User, { foreignKey: 'manager_id', as: 'manager' });
    User.hasMany(db.User, { foreignKey: 'manager_id', as: 'team' });
    User.hasMany(db.Attendance, { foreignKey: 'user_id', as: 'attendances' });
    User.hasMany(db.Leave, { foreignKey: 'user_id', as: 'leaves' });
  };

  return User;
};
