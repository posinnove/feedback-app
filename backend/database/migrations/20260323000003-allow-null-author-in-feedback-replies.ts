import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.changeColumn('feedback_replies', 'author_id', {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: true,
  });

  await queryInterface.changeColumn('feedback_replies', 'author_type', {
    type: DataTypes.ENUM('user', 'company'),
    allowNull: true,
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.changeColumn('feedback_replies', 'author_id', {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
  });

  await queryInterface.changeColumn('feedback_replies', 'author_type', {
    type: DataTypes.ENUM('user', 'company'),
    allowNull: false,
  });
}
