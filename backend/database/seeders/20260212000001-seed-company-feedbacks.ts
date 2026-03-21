import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash('Test@12345', 10);

  await queryInterface.bulkInsert('companies', [
    {
      name: 'Posinnove',
      slug: 'posinnove',
      email: 'contact@posinnove.com',
      password: hashedPassword,
      location: 'Kigali, Rwanda',
      website: 'https://posinnove.com',
      description:
        'We are an organization dedicated to creating practical education that aligns with industry needs.',
      logo_url: null,
      is_email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
      password_reset_token: null,
      password_reset_expires: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      name: 'Irembo',
      slug: 'irembo',
      email: 'contact@irembo.com',
      password: hashedPassword,
      location: 'Kigali, Rwanda',
      website: 'https://irembo.com',
      description:
        'Irembo is a technology company that builds digital solutions to improve the delivery of government services.',
      logo_url: null,
      is_email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
      password_reset_token: null,
      password_reset_expires: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);

  // Find the Posinnove company
  const [companies] = await queryInterface.sequelize.query(
    `SELECT id FROM companies WHERE slug = 'posinnove' LIMIT 1;`,
  );
  const companyId = (companies as { id: number }[])[0].id;

  // Insert feedbacks for Posinnove
  await queryInterface.bulkInsert('feedbacks', [
    {
      company_id: companyId,
      title:
        'Using pocketbase as the backend for sheetwa surprised me in a good way',
      description:
        'While building sheetwa, I wanted a backend that stayed out of the way. I did not want to manage heavy infrastructure or spend time wiring things I barely needed. That is when I tried pocketbase. What worked well for my use case.',
      status: 'completed',
      upvotes: 3,
      downvotes: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      company_id: companyId,
      title:
        'Deploying cloud solutions for scalability and continuous integrity',
      description:
        'Super fast setup. I had auth, database, and file handling running almost immediately. Local first development felt simple and predictable.',
      status: 'in-progress',
      upvotes: 12,
      downvotes: 2,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      company_id: companyId,
      title: 'Integrating AI for data analysis and insights',
      description:
        'It handled small but important things like user management and permissions without extra layers. Exploring machine learning capabilities to enhance our data processing pipeline.',
      status: 'planned',
      upvotes: 7,
      downvotes: 1,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
  // Irembo has no feedbacks — to test empty board state
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('feedbacks', {});
  await queryInterface.bulkDelete('companies', {
    slug: ['posinnove', 'irembo'],
  } as Record<string, unknown>);
}
