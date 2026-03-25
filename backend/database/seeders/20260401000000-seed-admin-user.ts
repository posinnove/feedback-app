import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash('Admin@12345', 10);

  await queryInterface.bulkInsert('users', [
    {
      first_name: 'Super',
      last_name: 'Admin',
      email: 'admin@voxela.com',
      password: hashedPassword,
      phone_number: null,
      is_email_verified: true,
      is_admin: true, // Marking as Admin
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
    email: 'admin@voxela.com',
  } as Record<string, unknown>);
}
