import { DataTypes, QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.createTable('feedback_reply_votes', {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    reply_id: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      references: {
        model: 'feedback_replies',
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

  await queryInterface.addIndex('feedback_reply_votes', ['reply_id']);
  await queryInterface.addIndex('feedback_reply_votes', [
    'voter_id',
    'voter_type',
  ]);
  await queryInterface.addIndex(
    'feedback_reply_votes',
    ['reply_id', 'voter_id', 'voter_type'],
    {
      unique: true,
      name: 'feedback_reply_votes_unique_voter_per_reply',
    },
  );
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.dropTable('feedback_reply_votes');
}
