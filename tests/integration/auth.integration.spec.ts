import sgMail from '@sendgrid/mail';
import { expect, request, use } from 'chai';
import chaiHttp from 'chai-http';
import { UniqueConstraintError } from 'sequelize';
import { createSandbox, SinonStub } from 'sinon';
import app from '../../src/express';
import HttpStatus from '../../src/models/enums/http-status.enum';
import User from '../../src/models/user.model';

use(chaiHttp);

describe('auth integration tests', () => {
  const sandbox = createSandbox();

  let createUserStub: SinonStub;

  beforeEach(() => {
    createUserStub = sandbox.stub();

    sandbox.stub(User, 'create').callsFake(createUserStub);
    sandbox.stub(sgMail, 'send').resolves(undefined);
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('register', () => {
    describe('valid body', () => {
      const body = {
        email: 'abc@def.com',
        password: 'ABCdef123_',
        passwordConfirmation: 'ABCdef123_',
      };

      it('should register correctly', async () => {
        const fakeUser = sandbox.createStubInstance(User);
        fakeUser.id = 1;
        fakeUser.email = 'abc@def.com';

        createUserStub.resolves(fakeUser);

        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.CREATED);
        expect(res.body).to.deep.equal({ user: { id: 1, email: body.email } });
      });

      it('user already exists - should return 409 status', async () => {
        createUserStub.rejects(new UniqueConstraintError({}));

        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.CONFLICT);
        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.CONFLICT,
          name: 'Conflict',
          message: 'Email is already in use.',
        });
      });
    });

    describe('invalid body', () => {
      const body = {
        email: 'abc@def.com',
        password: 'ABCdef123_',
        passwordConfirmation: 'ABCdef123',
      };

      it('should return 400 status code', async () => {
        const res = await request(app).post('/auth/register').send(body);

        expect(res.status).to.equal(HttpStatus.BAD_REQUEST);

        expect(res.body).to.deep.equal({
          statusCode: HttpStatus.BAD_REQUEST,
          name: 'Bad Request',
          message: {
            description: 'Validation error.',
            errors: ['passwords do not match.'],
          },
        });
      });
    });
  });
});
