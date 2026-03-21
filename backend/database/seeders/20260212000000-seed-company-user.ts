import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash('Test@12345', 10);

  await queryInterface.bulkInsert('users', [
    {
      first_name: 'Arsene',
      last_name: 'Shema',
      email: 'arsene@posinnove.com',
      password: hashedPassword,
      phone_number: '+250780000001',
      is_email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
      password_reset_token: null,
      password_reset_expires: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      first_name: 'Dev',
      last_name: 'User',
      email: 'dev@example.com',
      password: hashedPassword,
      phone_number: '+250780000002',
      is_email_verified: true,
      email_verification_token: null,
      email_verification_expires: null,
      password_reset_token: null,
      password_reset_expires: null,
      created_at: new Date(),
      updated_at: new Date(),
    },
  ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
  await queryInterface.bulkDelete('users', {
    email: ['arsene@posinnove.com', 'dev@example.com'],
  } as Record<string, unknown>);
}
