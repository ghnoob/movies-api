import { join } from 'path';
import { SequelizeOptions } from 'sequelize-typescript';
import logger from '../logger';

/**
 * Sequelize connection options.
 */
const dbConfig: SequelizeOptions = {
  dialect: 'postgres',
  host: process.env.DB_HOST || 'postgres',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
  database: process.env.DB_NAME || 'movies-api',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'admin',
  logging: logger.debug.bind(logger),
  models: [join(__dirname, '..', 'models')],
};

// has to be exported this way so sequelize-cli is able to read it
export = dbConfig;
