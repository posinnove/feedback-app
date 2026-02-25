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
            role: 'company',
            created_at: new Date(),
            updated_at: new Date(),
        },
        {
            first_name: 'Irembo',
            last_name: 'Admin',
            email: 'admin@irembo.com',
            password: hashedPassword,
            phone_number: '+250780000002',
            role: 'company',
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
