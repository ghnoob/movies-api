import { hash } from 'bcrypt';
import { QueryInterface } from 'sequelize';

const seeder = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.insert(
        null,
        'users',
        {
          email: 'john.doe@domain.com',
          password: await hash('1234567890', 10),
        },
        {
          transaction,
        },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.delete(
        null,
        'users',
        { email: 'john.doe@domain.com' },
        { transaction },
      );
    });
  },
};

export default seeder;
