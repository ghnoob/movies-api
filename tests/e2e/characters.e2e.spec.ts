import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { sign } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import appConfig from '../../src/config/app.config';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import Character from '../../src/models/character.model';
import HttpStatus from '../../src/models/enums/http-status.enum';

use(chaiHttp);

describe('characters e2e tests', () => {
  let db: Sequelize, seeder: Seeder, bearerToken: string;

  before(async () => {
    db = Container.get(DbConnection).getConnection();
    seeder = Container.get(Seeder);

    // the token will be used for future requests
    bearerToken =
      'Bearer ' +
      sign(
        { user: { id: 1, email: 'john.doe@domain.com' } },
        appConfig.JWT_SECRET_KEY,
      );

    // clear db to seed later
    await db.getQueryInterface().dropAllTables();
  });

  beforeEach(async () => {
    await db.sync();
    await seeder.initialize();
  });

  afterEach(async () => {
    await db.getQueryInterface().dropAllTables();
  });

  describe('/characters', () => {
    describe('post', () => {
      it('should create a new character', async () => {
        const countBeforeCreate = await Character.count();

        const res = await request(app)
          .post('/characters')
          .set('Authorization', bearerToken)
          .send({ name: 'Mickey Mouse' });

        expect(res.status).to.equal(HttpStatus.CREATED);

        expect(res.body).to.have.property('id', countBeforeCreate + 1);
      });

      it('should not authorize', async () => {
        const res = await request(app)
          .post('/characters')
          .send({ name: 'Mickey Mouse' });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });
    });
  });
});
