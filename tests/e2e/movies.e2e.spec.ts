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

/**
 * Checks if an array is sorted.
 * @param arr Array to check.
 * @param comparatorFunction Function to compare the elements of the array.
 * @returns A boolean indicating if the array is sorted or not.
 */
function isSorted<T = unknown>(
  arr: T[],
  comparatorFunction: (firstElement: T, secondElement: T) => boolean,
): boolean {
  for (let i = 0; i < arr.length - 1; i++) {
    if (!comparatorFunction(arr[i], arr[i + 1])) {
      return false;
    }
  }

  return true;
}

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
    describe('get', () => {
      it('default params', async () => {
        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.lengthOf(4);

        expect(
          isSorted(
            res.body.data as Movie[],
            (a, b) => a.createdAt < b.createdAt,
          ),
        ).to.be.true;
      });

      it('pagination', async () => {
        const res = await request(app)
          .get('/movies')
          .query({ page: '2', limit: '2' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.has.length(2);
      });

      it('all filters', async () => {
        const res = await request(app).get('/movies').query({
          title: 'star wars',
          genre: '12',
          order: 'DESC',
        });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body)
          .to.have.property('data')
          .that.is.an('array')
          .and.deep.equals([
            {
              id: 4,
              title: 'Rogue One: A Star Wars Story',
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/en/thumb/d/d4/Rogue_One%2C_A_Star_Wars_Story_poster.png/220px-Rogue_One%2C_A_Star_Wars_Story_poster.png',
              createdAt: new Date(2016, 12, 16).toISOString(),
            },
            {
              id: 3,
              title: 'Star Wars: Episode V - The Empire Strikes Back',
              imageUrl:
                'https://upload.wikimedia.org/wikipedia/en/3/3f/The_Empire_Strikes_Back_%281980_film%29.jpg',
              createdAt: new Date(1980, 5, 21).toISOString(),
            },
          ]);

        expect(
          isSorted(
            res.body.data as Movie[],
            (a, b) => a.createdAt > b.createdAt,
          ),
        ).to.be.true;
      });

      it('invalid genre shold be considered as null', async () => {
        const res = await request(app).get('/movies').query({ genre: 'abc' });

        expect(res.status).to.equal(HttpStatus.OK);

        expect(res.body).to.have.property('data').that.deep.equals([]);
      });
    });

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
