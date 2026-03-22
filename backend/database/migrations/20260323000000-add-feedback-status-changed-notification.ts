import type { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  // Add the new 'feedback_status_changed' to the notification type enum
  await queryInterface.sequelize.query(
    `ALTER TYPE "enum_notifications_type" ADD VALUE 'feedback_status_changed'`,
  );
}

export async function down(_queryInterface: QueryInterface): Promise<void> {
  // Note: PostgreSQL ENUMs cannot be easily rolled back
  // If needed, a more complex migration would be required
  // For now, we'll just leave this as is
}
