module.exports = (sequelize, DataTypes) => {
  const Attendance = sequelize.define('Attendance', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    date: { type: DataTypes.DATEONLY, allowNull: false },
    check_in: { type: DataTypes.DATE },
    check_out: { type: DataTypes.DATE },
    work_minutes: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('present', 'half_day'), defaultValue: 'present' },
  }, {
    tableName: 'attendances',
    underscored: true,
    indexes: [{ unique: true, fields: ['user_id', 'date'] }],
  });

  Attendance.associate = (db) => {
    Attendance.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
  };

  return Attendance;
};
