import { request, expect, use } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import { ForeignKeyConstraintError } from 'sequelize';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import Movie from '../../src/models/movie.model';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('/movies integration test', () => {
  let sandbox: SinonSandbox, passportStub: SinonStub;

  before(() => {
    sandbox = createSandbox();
  });

  beforeEach(() => {
    passportStub = sandbox
      .stub(passport, 'authenticate')
      .returns(() => undefined);

    sandbox.stub(User, 'findByPk').resolves(sandbox.createStubInstance(User));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('/movies', () => {
    describe('get', () => {
      it('should return 200 status code', async () => {
        sandbox
          .stub(Movie, 'findAndCountAll')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .resolves({ rows: [], count: 0 as any }); // overloads dont work for some reason

        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.deep.equal({
          data: [],
          total: 0,
          totalPages: 0,
        });
      });

      it('should return 500 status code', async () => {
        sandbox.stub(Movie, 'findAndCountAll').rejects(new Error());

        const res = await request(app).get('/movies');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });

    describe('post', () => {
      const body = { title: 'The Lion King', genreId: 1 };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yields(null, { id: 1, email: 'abc@gmail.com' });
        });

        it('should return 201 status code', async () => {
          const mockMovie = sandbox.createStubInstance(Movie);
          mockMovie.id = 1;

          sandbox.stub(Movie, 'create').resolves(mockMovie);

          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.CREATED);
        });

        it('should return 400 status code', async () => {
          const res = await request(app).post('/movies').send({ title: 'abc' });

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.deep.property('errors', [
              'genreId must be an integer number',
            ]);
        });

        it('should return 422 status code', async () => {
          sandbox
            .stub(Movie, 'create')
            .rejects(new ForeignKeyConstraintError({}));

          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.UNPROCESSABLE_ENTITY);

          expect(res.body).to.have.property(
            'message',
            'Genre with id 1 does not exist.',
          );
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yields(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).post('/movies').send(body);

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });
});
