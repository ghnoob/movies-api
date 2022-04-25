import { DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'characters',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
          },
          name: DataTypes.STRING(30),
          imageUrl: DataTypes.STRING(2048),
          age: DataTypes.INTEGER,
          weight: DataTypes.INTEGER,
          history: DataTypes.STRING(1000),
        },
        { transaction },
      );
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable('characters', { transaction });
    });
  },
};

export default migration;
