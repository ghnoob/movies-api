import { expect, use } from 'chai';
import { noCallThru } from 'proxyquire';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';

const proxyquire = noCallThru();

use(sinonChai);

describe('index file tests', () => {
  const sandbox = createSandbox();

  const cpSpawnStub = sandbox.stub(),
    loggerStub = sandbox.stub();

  const overrides = (environment: string) => ({
    'reflect-metadata': () => ({}),
    'child_process': {
      spawn: cpSpawnStub,
    },
    'dotenv': {
      config: () => 'test',
    },
    'sequelize-typescript': {
      Sequelize: sandbox.stub().callsFake(function () {
        return { authenticate: () => ({}), sync: () => ({}) };
      }),
    },
    './express': { listen: (_port: number, cb: () => void) => cb() },
    './config/app.config': {
      ENVIRONMENT: environment,
    },
    './config/db.config': {
      validateOnly: true,
    },
    './logger': {
      info: loggerStub,
    },
  });

  afterEach(() => {
    sandbox.resetHistory();
  });

  it('development', async () => {
    const bootstrap = proxyquire(
      '../../src/bootstrap',
      overrides('development'),
    ).default;
    await bootstrap();

    expect(cpSpawnStub).to.have.been.calledOnceWith(
      'npx sequelize db:seed:all',
    );
  });

  it('debug', async () => {
    const bootstrap = proxyquire(
      '../../src/bootstrap',
      overrides('debug'),
    ).default;
    await bootstrap();

    expect(cpSpawnStub).to.have.been.calledOnceWith(
      'npx sequelize db:seed:all --debug',
    );
  });

  it('production', async () => {
    const bootstrap = proxyquire(
      '../../src/bootstrap',
      overrides('production'),
    ).default;
    await bootstrap();

    expect(cpSpawnStub).to.not.have.been.called;
    expect(loggerStub).callCount(2);
  });
});
