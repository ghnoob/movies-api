import { QueryInterface } from 'sequelize';

const seeder = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(
        'movies-characters',
        [
          { movieId: 1, characterId: 1 },
          { movieId: 1, characterId: 2 },
          { movieId: 2, characterId: 3 },
          { movieId: 3, characterId: 4 },
          { movieId: 3, characterId: 5 },
          { movieId: 4, characterId: 4 },
        ],
        { transaction },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkDelete('movies-characters', { transaction });
    });
  },
};

export default seeder;
