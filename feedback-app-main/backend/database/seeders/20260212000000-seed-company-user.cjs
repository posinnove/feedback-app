'use strict';

const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
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
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('users', {
            email: 'arsene@posinnove.com',
        });
    },
};
