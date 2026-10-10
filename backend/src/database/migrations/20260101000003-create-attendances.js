module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('attendances', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      date: { type: Sequelize.DATEONLY, allowNull: false },
      check_in: { type: Sequelize.DATE },
      check_out: { type: Sequelize.DATE },
      work_minutes: { type: Sequelize.INTEGER, defaultValue: 0 },
      status: { type: Sequelize.ENUM('present', 'half_day'), defaultValue: 'present' },
      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.literal('CURRENT_TIMESTAMP') },
    });
    await queryInterface.addIndex('attendances', ['user_id', 'date'], { unique: true, name: 'attendances_user_date_unique' });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('attendances');
  },
};
