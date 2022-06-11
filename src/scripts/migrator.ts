import { Container } from 'typedi';
import UmzugFactory from '../database/umzug';

if (require.main === module) {
  Container.get(UmzugFactory).create('../database/migrations/*.ts').runAsCLI();
}
