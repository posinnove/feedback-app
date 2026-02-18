'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface) {
        // Find the seeded user
        const [users] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = 'arsene@posinnove.com' LIMIT 1;`
        );
        const userId = users[0].id;

        // Insert company
        await queryInterface.bulkInsert('companies', [
            {
                user_id: userId,
                name: 'Posinnove',
                slug: 'posinnove',
                description:
                    'We are an organization dedicated to creating practical education that aligns with industry needs.',
                logo_url: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        // Find the company
        const [companies] = await queryInterface.sequelize.query(
            `SELECT id FROM companies WHERE slug = 'posinnove' LIMIT 1;`
        );
        const companyId = companies[0].id;

        // Insert feedbacks
        await queryInterface.bulkInsert('feedbacks', [
            {
                company_id: companyId,
                title: 'Using pocketbase as the backend for sheetwa surprised me in a good way',
                description:
                    'While building sheetwa, I wanted a backend that stayed out of the way. I did not want to manage heavy infrastructure or spend time wiring things I barely needed. That is when I tried pocketbase. What worked well for my use case.',
                status: 'completed',
                upvotes: 3,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                company_id: companyId,
                title: 'Deploying cloud solutions for scalability and continuous integrity',
                description:
                    'Super fast setup. I had auth, database, and file handling running almost immediately. Local first development felt simple and predictable.',
                status: 'in-progress',
                upvotes: 12,
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
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);

        // Insert Irembo company (no feedbacks — to test empty board state)
        const [iremboUsers] = await queryInterface.sequelize.query(
            `SELECT id FROM users WHERE email = 'admin@irembo.com' LIMIT 1;`
        );
        const iremboUserId = iremboUsers[0].id;

        await queryInterface.bulkInsert('companies', [
            {
                user_id: iremboUserId,
                name: 'Irembo',
                slug: 'irembo',
                description:
                    'Irembo is a technology company that builds digital solutions to improve the delivery of government services.',
                logo_url: null,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface) {
        await queryInterface.bulkDelete('feedbacks', null);
        await queryInterface.bulkDelete('companies', {
            slug: ['posinnove', 'irembo'],
        });
    },
};
