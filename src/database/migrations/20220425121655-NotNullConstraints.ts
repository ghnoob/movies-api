import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'characters',
        'name',
        {
          allowNull: false,
          type: DataTypes.STRING(30),
        },
        {
          transaction,
        },
      );

      await queryInterface.changeColumn(
        'genres',
        'name',
        {
          allowNull: false,
          type: DataTypes.STRING(30),
        },
        {
          transaction,
        },
      );

      await queryInterface.changeColumn(
        'movies',
        'title',
        {
          allowNull: false,
          type: DataTypes.STRING(100),
        },
        {
          transaction,
        },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.changeColumn(
        'characters',
        'name',
        {
          allowNull: true,
          type: DataTypes.STRING(30),
        },
        {
          transaction,
        },
      );

      await queryInterface.changeColumn(
        'genres',
        'name',
        {
          allowNull: true,
          type: DataTypes.STRING(30),
        },
        {
          transaction,
        },
      );

      await queryInterface.changeColumn(
        'movies',
        'title',
        {
          allowNull: true,
          type: DataTypes.STRING(100),
        },
        {
          transaction,
        },
      );
    });
  },
};

export default migration;
