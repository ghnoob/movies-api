import { col, fn, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addIndex('characters', {
        name: 'name_idx',
        fields: [fn('to_tsvector', 'english', col('name'))],
        using: 'gin',
        transaction,
      });

      await queryInterface.addIndex('movies', {
        name: 'name_idx',
        fields: [fn('to_tsvector', 'english', col('name'))],
        using: 'gin',
        transaction,
      });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('movies', 'title_idx', { transaction });

      await queryInterface.removeIndex('characters', 'name_idx', {
        transaction,
      });
    });
  },
};

export default migration;
