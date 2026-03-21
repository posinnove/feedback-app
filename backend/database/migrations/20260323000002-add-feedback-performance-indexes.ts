import type { QueryInterface } from 'sequelize';

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addIndex('feedbacks', ['company_id', 'status'], {
      name: 'feedbacks_company_status_idx',
    });

    await queryInterface.addIndex('feedbacks', ['created_at'], {
      name: 'feedbacks_created_at_idx',
    });

    await queryInterface.addIndex('feedbacks', ['upvotes', 'downvotes'], {
      name: 'feedbacks_vote_score_idx',
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeIndex('feedbacks', 'feedbacks_vote_score_idx');
    await queryInterface.removeIndex('feedbacks', 'feedbacks_created_at_idx');
    await queryInterface.removeIndex(
      'feedbacks',
      'feedbacks_company_status_idx',
    );
  },
};
