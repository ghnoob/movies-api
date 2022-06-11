import 'reflect-metadata';
import { spawn } from 'child_process';
import { config } from 'dotenv';
import { Container } from 'typedi';

config();

import DbConnection from './database/connection';
import app from './express';
import appConfig from './config/app.config';
import logger from './logger';

export default async function bootstrap() {
  const db = Container.get(DbConnection).getConnection();

  await db.authenticate();

  if (appConfig.ENVIRONMENT !== 'production') {
    await db.sync({ force: true });

    let command = 'npx sequelize db:seed:all';

    if (appConfig.ENVIRONMENT === 'debug') {
      command += ' --debug';
    }

    spawn(command, { shell: true });
  }

  logger.info('Database connected.');

  app.listen(appConfig.PORT, () => {
    logger.info(`App listening on port ${appConfig.PORT}`);
  });
}
