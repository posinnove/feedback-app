import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('users', 'theme_mode', {
    type: DataTypes.ENUM('system', 'light', 'dark'),
    allowNull: false,
    defaultValue: 'system',
  });

  await queryInterface.addColumn('companies', 'theme_mode', {
    type: DataTypes.ENUM('system', 'light', 'dark'),
    allowNull: false,
    defaultValue: 'system',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('companies', 'theme_mode');
  await queryInterface.removeColumn('users', 'theme_mode');
}
