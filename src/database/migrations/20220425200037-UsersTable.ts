import { col, fn, DataTypes, QueryInterface } from 'sequelize';

const migration = {
  async up(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        'users',
        {
          id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true,
            autoIncrementIdentity: true,
          },
          email: {
            type: DataTypes.STRING(320),
            allowNull: false,
          },
          password: {
            type: DataTypes.STRING,
            allowNull: false,
          },
        },
        { transaction },
      );

      await queryInterface.addIndex('users', {
        name: 'email_idx',
        unique: true,
        fields: [fn('lower', col('email'))],
        transaction,
      });
    });
  },

  async down(queryInterface: QueryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeIndex('users', 'email_idx', { transaction });

      await queryInterface.dropTable('users', { transaction });
    });
  },
};

export default migration;
