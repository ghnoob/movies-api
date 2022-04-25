import { col, fn, DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'genres',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
          },
          name: DataTypes.STRING(30),
        },
        {
          transaction,
        },
      );

      await queryInterface.addIndex('genres', {
        name: 'unique_name',
        unique: true,
        fields: [fn('lower', col('name'))],
        transaction,
      });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('genres', 'unique_name', {
        transaction,
      });

      await queryInterface.dropTable('genres', { transaction });
    });
  },
};

export default migration;
