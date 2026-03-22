import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.changeColumn('users', 'avatar_url', {
    type: DataTypes.TEXT,
    allowNull: true,
  });

  await queryInterface.changeColumn('companies', 'logo_url', {
    type: DataTypes.TEXT,
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.changeColumn('users', 'avatar_url', {
    type: DataTypes.STRING,
    allowNull: true,
  });

  await queryInterface.changeColumn('companies', 'logo_url', {
    type: DataTypes.STRING,
    allowNull: true,
  });
}
