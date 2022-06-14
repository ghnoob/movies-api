import { Server } from 'http';
import { expect, use } from 'chai';
import { noCallThru } from 'proxyquire';
import { Sequelize } from 'sequelize-typescript';
import { createSandbox, SinonSandbox, SinonSpy, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import { QueryInterface } from 'sequelize';
import appConfig from '../../src/config/app.config';
import app from '../../src/express';
import logger from '../../src/logger';
import DbConnection from '../../src/database/connection';
import Seeder from '../../src/database/seeder';

use(sinonChai);

const proxyquire = noCallThru();

describe('bootstrap tests', () => {
  let sandbox: SinonSandbox,
    bootstrap: () => Promise<void>,
    containerStub: SinonStub,
    loggerSpy: SinonSpy;

  before(() => {
    sandbox = createSandbox();
  });

  beforeEach(() => {
    containerStub = sandbox
      .stub()
      .onFirstCall()
      .returns(
        sandbox.createStubInstance(DbConnection, {
          getConnection: sandbox.createStubInstance(Sequelize, {
            getQueryInterface: sandbox.createStubInstance(QueryInterface),
          }),
        }),
      )
      .onSecondCall()
      .returns(sandbox.createStubInstance(Seeder));

    sandbox.stub(app, 'listen').callsFake((_port: number, cb?: () => void) => {
      if (cb) {
        cb();
      }

      return sandbox.createStubInstance(Server);
    });

    loggerSpy = sandbox.spy(logger, 'info');

    bootstrap = proxyquire('../../src/bootstrap', {
      typedi: {
        Container: {
          get: containerStub,
        },
      },
    }).default;
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('development', async () => {
    sandbox.stub(appConfig, 'ENVIRONMENT').value('development');

    await bootstrap();

    expect(containerStub).to.have.been.calledTwice;
  });

  it('production', async () => {
    sandbox.stub(appConfig, 'ENVIRONMENT').value('production');

    await bootstrap();

    expect(containerStub).to.have.been.calledOnce;
    expect(loggerSpy).to.have.been.calledTwice;
  });
});
