import { Container } from 'typedi';
import DbConnection from './database/connection';
import app from './express';
import appConfig from './config/app.config';
import logger from './logger';
import Seeder from './database/seeder';

export default async function bootstrap() {
  const db = Container.get(DbConnection).getConnection();

  await db.authenticate();

  if (appConfig.ENVIRONMENT !== 'production') {
    await db.sync({ force: true });

    await Container.get(Seeder).initialize();
  }

  logger.info('Database connected.');

  app.listen(appConfig.PORT, () => {
    logger.info(`App listening on port ${appConfig.PORT}`);
  });
}
