module.exports = (sequelize, DataTypes) => {
  const Leave = sequelize.define('Leave', {
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('casual', 'sick', 'paid'), allowNull: false },
    from_date: { type: DataTypes.DATEONLY, allowNull: false },
    to_date: { type: DataTypes.DATEONLY, allowNull: false },
    days: { type: DataTypes.INTEGER, allowNull: false },
    reason: { type: DataTypes.STRING(500), allowNull: false },
    status: { type: DataTypes.ENUM('pending', 'approved', 'rejected'), allowNull: false, defaultValue: 'pending' },
    reviewed_by: { type: DataTypes.INTEGER },
    reviewed_at: { type: DataTypes.DATE },
    review_note: { type: DataTypes.STRING(255) },
  }, { tableName: 'leaves', underscored: true });

  Leave.associate = (db) => {
    Leave.belongsTo(db.User, { foreignKey: 'user_id', as: 'user' });
    Leave.belongsTo(db.User, { foreignKey: 'reviewed_by', as: 'reviewer' });
  };

  return Leave;
};
