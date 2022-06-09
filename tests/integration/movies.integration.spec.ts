import { request, expect, use } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox, SinonSandbox } from 'sinon';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import Movie from '../../src/models/movie.model';

use(chaiHttp);

describe('/movies integration test', () => {
  let sandbox: SinonSandbox;

  before(() => {
    sandbox = createSandbox();
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
  });
});
