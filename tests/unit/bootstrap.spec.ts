import { expect, use } from 'chai';
import { noCallThru } from 'proxyquire';
import { createSandbox } from 'sinon';
import sinonChai from 'sinon-chai';
import appConfig from '../../src/config/app.config';
import logger from '../../src/logger';

use(sinonChai);

const proxyquire = noCallThru();

describe('index file tests', () => {
  let environmentTemp: string;

  const sandbox = createSandbox(),
    cpSpawnStub = sandbox.stub(),
    loggerStub = sandbox.stub(logger, 'info');

  const bootstrap: () => Promise<void> = proxyquire('../../src/bootstrap', {
    'child_process': {
      spawn: cpSpawnStub,
    },
    'sequelize-typescript': {
      Sequelize: function () {
        return { authenticate: () => undefined, sync: () => undefined };
      },
    },
    './express': {
      listen: (_port: number, cb: () => void) => cb(),
    },
  }).default;

  before(() => {
    environmentTemp = appConfig.ENVIRONMENT;
  });

  afterEach(() => {
    appConfig.ENVIRONMENT = environmentTemp;
    sandbox.resetHistory();
  });

  it('development', async () => {
    appConfig.ENVIRONMENT = 'development';

    await bootstrap();

    expect(cpSpawnStub).to.have.been.calledOnceWith(
      'npx sequelize db:seed:all',
    );
  });

  it('debug', async () => {
    appConfig.ENVIRONMENT = 'debug';

    await bootstrap();

    expect(cpSpawnStub).to.have.been.calledOnceWith(
      'npx sequelize db:seed:all --debug',
    );
  });

  it('production', async () => {
    appConfig.ENVIRONMENT = 'production';

    await bootstrap();

    expect(cpSpawnStub).to.not.have.been.called;
    expect(loggerStub).callCount(2);
  });
});
