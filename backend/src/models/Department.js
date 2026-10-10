module.exports = (sequelize, DataTypes) => {
  const Department = sequelize.define('Department', {
    name: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    description: { type: DataTypes.STRING(255) },
  }, { tableName: 'departments', underscored: true });

  Department.associate = (db) => {
    Department.hasMany(db.User, { foreignKey: 'department_id', as: 'employees' });
  };

  return Department;
};
