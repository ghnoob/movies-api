import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import isJwt from 'validator/lib/isJWT';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';

use(chaiHttp);

describe('auth e2e tests', () => {
  let db: Sequelize, seeder: Seeder;

  before(async () => {
    db = Container.get(DbConnection).getConnection();
    await db.authenticate();
    await db.sync({ force: true });

    seeder = Container.get(Seeder);
  });

  beforeEach(async () => {
    await seeder.initialize();
  });

  afterEach(async () => {
    await seeder.revert();
  });

  describe('login', () => {
    it('should return 200 status code', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'john.doe@domain.com',
        password: '1234567890',
      });

      expect(res.status).to.equal(HttpStatus.OK);
      expect(res.body).to.have.property('token');
      expect(isJwt(res.body.token)).to.be.true;
    });

    it('should return 401 status code', async () => {
      const res = await request(app).post('/auth/login').send({
        email: 'john.doe@domain.com',
        password: '123456789',
      });

      expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
    });
  });
});
