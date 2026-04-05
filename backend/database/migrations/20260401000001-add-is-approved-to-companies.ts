import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.addColumn('companies', 'is_approved', {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.removeColumn('companies', 'is_approved');
}
