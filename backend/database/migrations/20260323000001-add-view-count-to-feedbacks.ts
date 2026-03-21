import type { QueryInterface, DataTypes as DT } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DT) => {
    await queryInterface.addColumn('feedbacks', 'view_count', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0,
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn('feedbacks', 'view_count');
  },
};
