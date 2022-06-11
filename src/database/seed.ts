import { Sequelize } from 'sequelize-typescript';
import { Service } from 'typedi';
import { Umzug } from 'umzug';
import UmzugFactory from './umzug';

@Service()
export default class Seeder {
  private umzug: Umzug<Sequelize>;

  constructor(umzugFactory: UmzugFactory) {
    this.umzug = umzugFactory.create('seeders/*.ts');
  }

  initialize() {
    return this.umzug.up();
  }
}
