import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { createSandbox, SinonSandbox } from 'sinon';
import app from '../../src/express';
import Character from '../../src/models/character.model';
import HttpStatus from '../../src/models/enums/http-status.enum';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('characters integration tests', () => {
  let sandbox: SinonSandbox;

  before(() => {
    sandbox = createSandbox();
  });

  beforeEach(() => {
    sandbox.stub(User, 'findByPk').resolves(sandbox.createStubInstance(User));
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('/movies', () => {
    describe('get', () => {
      it('should return 200 status code', async () => {
        sandbox
          .stub(Character, 'findAndCountAll')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .resolves({ rows: [], count: 0 as any }); // overloads dont work for some reason

        const res = await request(app).get('/characters');

        expect(res.status).to.equal(HttpStatus.OK);
        expect(res.body).to.deep.equal({
          data: [],
          total: 0,
          totalPages: 0,
        });
      });

      it('should return 500 status code', async () => {
        sandbox.stub(Character, 'findAndCountAll').rejects(new Error());

        const res = await request(app).get('/characters');

        expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
      });
    });
  });
});
