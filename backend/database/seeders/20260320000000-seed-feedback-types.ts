import { QueryInterface } from 'sequelize';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const now = new Date();
  await queryInterface.bulkInsert('feedback_types', [
    {
      name: 'Feature Request',
      slug: 'feature-request',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Bug Report',
      slug: 'bug-report',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Improvement',
      slug: 'improvement',
      created_at: now,
      updated_at: now,
    },
    {
      name: 'Question',
      slug: 'question',
      created_at: now,
      updated_at: now,
    },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('feedback_types', {
    slug: ['feature-request', 'bug-report', 'improvement', 'question'],
  } as Record<string, unknown>);
}
