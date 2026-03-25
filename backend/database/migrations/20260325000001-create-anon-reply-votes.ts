import type { QueryInterface, DataTypes as DT } from 'sequelize';

export default {
  async up(queryInterface: QueryInterface, DataTypes: typeof DT) {
    await queryInterface.createTable('anon_reply_votes', {
      id: {
        type: DataTypes.INTEGER.UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      reply_id: {
        type: DataTypes.INTEGER.UNSIGNED,
        allowNull: false,
        references: { model: 'feedback_replies', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      fingerprint: {
        type: DataTypes.STRING(64),
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

    await queryInterface.addIndex('anon_reply_votes', ['reply_id']);
    await queryInterface.addIndex('anon_reply_votes', ['fingerprint']);
    await queryInterface.addIndex(
      'anon_reply_votes',
      ['reply_id', 'fingerprint'],
      { unique: true, name: 'anon_reply_votes_reply_fingerprint_unique' },
    );
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.dropTable('anon_reply_votes');
  },
};
