import 'reflect-metadata';
import { spawn } from 'child_process';
import { config } from 'dotenv';
import { Sequelize } from 'sequelize-typescript';

config();

import app from './express';
import appConfig from './config/app.config';
import dbConfig from './config/db.config';
import logger from './logger';

async function bootstrap() {
  try {
    const db = new Sequelize(dbConfig);
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
  } catch (err) {
    logger.error('Could not connect to the database');
    logger.error(err);
  }
}

bootstrap();
