import { QueryInterface, DataTypes } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('feedback_votes', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    feedback_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'feedbacks',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    voter_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    voter_type: {
      type: DataTypes.ENUM('user', 'company'),
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM('up', 'down'),
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

  await queryInterface.addIndex('feedback_votes', ['feedback_id']);
  await queryInterface.addIndex('feedback_votes', ['voter_id', 'voter_type']);
  await queryInterface.addConstraint('feedback_votes', {
    fields: ['feedback_id', 'voter_id', 'voter_type'],
    type: 'unique',
    name: 'feedback_votes_unique_feedback_voter',
  });
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('feedback_votes');
}
