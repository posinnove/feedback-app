import type { QueryInterface, DataTypes as DT } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DT) => {
    // Add the new 'feedback_status_changed' to the notification type enum
    await queryInterface.sequelize.query(
      `ALTER TYPE "enum_notifications_type" ADD VALUE 'feedback_status_changed'`,
    );
  },

  down: async (queryInterface: QueryInterface) => {
    // Note: PostgreSQL ENUMs cannot be easily rolled back
    // If needed, a more complex migration would be required
    // For now, we'll just leave this as is
  },
};
