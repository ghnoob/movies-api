import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { sign } from 'jsonwebtoken';
import { Sequelize } from 'sequelize-typescript';
import { Container } from 'typedi';
import appConfig from '../../src/config/app.config';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import Movie from '../../src/models/movie.model';

use(chaiHttp);

describe('movies e2e tests', () => {
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

  describe('/movies', () => {
    describe('post', () => {
      it('shold return a 201 status code', async () => {
        const countBeforeCreate = await Movie.count();

        const res = await request(app)
          .post('/movies')
          .set('Authorization', bearerToken)
          .send({ title: 'Chicken Little', genreId: 3 });

        expect(res.status).to.equal(HttpStatus.CREATED);

        expect(res.body).to.have.property('id', countBeforeCreate + 1);
      });

      it('rshould return a 401 status code', async () => {
        const res = await request(app)
          .post('/movies')
          .send({ title: 'Chicken Little', genreId: 3 });

        expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
      });

      it('shold return a 422 status code', async () => {
        const res = await request(app)
          .post('/movies')
          .set('Authorization', bearerToken)
          .send({ title: 'Chicken Little', genreId: 99 });

        expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);
      });
    });
  });
});
