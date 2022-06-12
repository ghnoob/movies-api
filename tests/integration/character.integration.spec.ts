import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import passport from 'passport';
import { createSandbox, SinonSandbox, SinonStub } from 'sinon';
import app from '../../src/express';
import Character from '../../src/models/character.model';
import HttpStatus from '../../src/models/enums/http-status.enum';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('characters integration tests', () => {
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

  describe('/characters', () => {
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

    describe('post', () => {
      const body = { name: 'Simba' };

      describe('authenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, { id: 1, email: 'abc@gmail.com' });
        });

        it('should return 201 status code', async () => {
          const mockCharacter = sandbox.createStubInstance(Character);
          mockCharacter.id = 1;

          sandbox.stub(Character, 'create').resolves(mockCharacter);

          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.CREATED);
        });

        it('should return 400 status code', async () => {
          const res = await request(app)
            .post('/characters')
            .send({ name: 123 });

          expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

          expect(res.body)
            .to.have.property('message')
            .that.has.property('errors')
            .and.contains.members(['name must be a string']);
        });

        it('should return 500 status code', async () => {
          sandbox.stub(Character, 'create').rejects(new Error());

          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
        });
      });

      describe('unauthenticated', () => {
        beforeEach(() => {
          passportStub.yieldsAsync(null, null);
        });

        it('should return 401 status code', async () => {
          const res = await request(app).post('/characters').send(body);

          expect(res.status).to.equal(HttpStatus.UNAUTHORIZED);
        });
      });
    });
  });
});
