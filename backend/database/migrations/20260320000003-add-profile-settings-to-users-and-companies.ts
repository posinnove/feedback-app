import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('users', 'email_notifications', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });

  await queryInterface.addColumn('users', 'weekly_digest', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });

  await queryInterface.addColumn('users', 'public_profile', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });

  await queryInterface.addColumn('companies', 'email_notifications', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });

  await queryInterface.addColumn('companies', 'weekly_digest', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });

  await queryInterface.addColumn('companies', 'public_profile', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('companies', 'public_profile');
  await queryInterface.removeColumn('companies', 'weekly_digest');
  await queryInterface.removeColumn('companies', 'email_notifications');

  await queryInterface.removeColumn('users', 'public_profile');
  await queryInterface.removeColumn('users', 'weekly_digest');
  await queryInterface.removeColumn('users', 'email_notifications');
}
