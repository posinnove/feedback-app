import type { QueryInterface, DataTypes as DT } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface, Sequelize: typeof DT) => {
    await queryInterface.createTable('notifications', {
      id: {
        type: Sequelize.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      recipient_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
      },
      recipient_type: {
        type: Sequelize.ENUM('user', 'company'),
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM(
          'feedback_created',
          'reply_created',
          'reply_to_your_reply',
        ),
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      feedback_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: false,
        references: {
          model: 'feedbacks',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      related_reply_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        allowNull: true,
        references: {
          model: 'feedback_replies',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      is_read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.addIndex('notifications', [
      'recipient_id',
      'recipient_type',
      'is_read',
    ]);
    await queryInterface.addIndex('notifications', ['created_at']);
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable('notifications');
  },
};
