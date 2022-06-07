import { expect, use } from 'chai';
import { stub, match } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { Expose } from 'class-transformer';
import { IsString } from 'class-validator';
import proxyquire from 'proxyquire';
import validateRequest from '../../../src/middlewares/validate-request.middleware';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('validate request middleware tests', () => {
  class ExampleClass {
    @Expose()
    @IsString()
    foo!: string;
  }

  const res = mockRes(),
    next = stub();

  afterEach(() => {
    next.resetHistory();
  });

  it('should pass validation', async () => {
    const req = mockReq({ body: { foo: 'string' } });

    await validateRequest(ExampleClass)(req, res, next);

    expect(req.body).to.be.instanceof(ExampleClass);
    expect(next).to.have.been.calledOnceWithExactly();
  });

  it('should not pass validation', async () => {
    const req = mockReq({ body: { foo: 1234 } });

    await validateRequest(ExampleClass)(req, res, next);

    expect(next).to.have.been.calledOnceWithExactly(
      match
        .instanceOf(HttpError)
        .and(match.has('status', HttpStatus.BAD_REQUEST)),
    );
  });

  it('should pass empty object on undefined body', async () => {
    const req = mockReq({ body: undefined });

    const plainToInstanceStub = stub().returns(new ExampleClass()),
      spiedMiddleware = proxyquire(
        '../../../src/middlewares/validate-request.middleware',
        {
          'class-transformer': {
            plainToInstance: plainToInstanceStub,
          },
        },
      ).default;

    await spiedMiddleware(ExampleClass)(req, res, next);

    expect(plainToInstanceStub).to.have.been.calledOnce;
    expect(plainToInstanceStub.lastCall.args[1]).to.deep.equal({});
  });
});
