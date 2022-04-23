import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up (queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable('movies', {
        id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true,
          autoIncrementIdentity: true,
        },
        title: DataTypes.STRING(100),
        imageUrl: DataTypes.STRING(2048),
        genreId: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: 'genre',
            key: 'id',
          },
        },
        rating: DataTypes.DECIMAL(2, 1),
        createdAt: DataTypes.DATE,
      }, { transaction });
    });
  },

  async down (queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('movies', { transaction });
    });
  }
};

export default migration;
