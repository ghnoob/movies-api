import { config } from 'dotenv';
import { Container } from 'typedi';
import UmzugFactory from '../database/umzug';

if (require.main === module) {
  config();

  Container.get(UmzugFactory).create('../database/migrations/*.ts').runAsCLI();
}
