import { col, fn, DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
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

      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },

  async down(queryInterface: QueryInterface) {
    const transaction = await queryInterface.sequelize.transaction();

    try {
      await queryInterface.removeIndex('genres', 'unique_name');
      await queryInterface.dropTable('genres');
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  },
};

export default migration;
