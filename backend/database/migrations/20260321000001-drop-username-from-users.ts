import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('users', 'username');
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('users', 'username', {
    type: DataTypes.STRING,
    allowNull: true,
    unique: true,
  });
}
