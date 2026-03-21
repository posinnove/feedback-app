import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('company_followers', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    company_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    follower_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    follower_type: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  await queryInterface.addIndex('company_followers', ['company_id']);
  await queryInterface.addIndex('company_followers', [
    'follower_id',
    'follower_type',
  ]);
  await queryInterface.addConstraint('company_followers', {
    fields: ['company_id', 'follower_id', 'follower_type'],
    type: 'unique',
    name: 'company_followers_unique_company_follower',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('company_followers');
}
