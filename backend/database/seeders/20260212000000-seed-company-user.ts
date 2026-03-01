import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export async function up(queryInterface: QueryInterface): Promise<void> {
    const hashedPassword = await bcrypt.hash('Test@12345', 10);

    await queryInterface.bulkInsert('users', [
        {
            user_name: 'arsene_shema',
            email: 'arsene@posinnove.com',
            password: hashedPassword,
            account_type: 'company',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            user_name: 'irembo_admin',
            email: 'admin@irembo.com',
            password: hashedPassword,
            account_type: 'company',
            created_at: new Date(),
            updated_at: new Date(),
        },
    ]);
}

export async function down(queryInterface: QueryInterface): Promise<void> {
    await queryInterface.bulkDelete('users', {
        email: ['arsene@posinnove.com', 'admin@irembo.com'],
    });
}
