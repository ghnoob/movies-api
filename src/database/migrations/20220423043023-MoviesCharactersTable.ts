import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('movies-characters', {
        movieId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'movies',
            key: 'id',
          },
        },
        characterId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'characters',
            key: 'id',
          },
        },
      }, { transaction });

      await queryInterface.addConstraint('movies-characters', {
        name: 'movies-characters_pkey',
        type: 'primary key',
        fields: ['movieId', 'characterId'],
        transaction,
      });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeConstraint('movies-characters', 'movies-characters_pkey', {
        transaction,
      });

      await queryInterface.dropTable('movies-characters', { transaction });
    });
  },
};

export default migration;