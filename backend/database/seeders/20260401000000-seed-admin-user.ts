import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: QueryInterface): Promise<void> {
  const hashedPassword = await bcrypt.hash('Bonheur@Voxella#2026', 10);

  await queryInterface.bulkInsert('users', [
    {
      first_name: 'Bonheur',
      last_name: 'Iraguha',
      email: 'bonheur.iraguha@voxella.app',
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
    {
      first_name: 'Fabrice',
      last_name: 'Mukunzi',
      email: 'fabrice.mukunzi@voxella.app',
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
  await queryInterface.bulkDelete('users', [
    { email: 'bonheur@voxella.app' },
    { email: 'fabrice.mukunzi@voxella.app' }
  ]);
}
