import { expect } from 'chai';
import { noPreserveCache } from 'proxyquire';

const proxyquire = noPreserveCache();

describe('app config tests', () => {
  it('should use default config', () => {
    const { default: appConfig } = proxyquire(
      '../../../src/config/app.config',
      {},
    );

    expect(appConfig).to.deep.equal({
      ENVIRONMENT: 'development',
      PORT: 3000,
      JWT_SECRET_KEY: 'default',
      SENDGRID_API_KEY: '',
      SENDGRID_EMAIL: '',
    });
  });

  it('should use provided env variables', () => {
    process.env.NODE_ENV = 'debug';
    process.env.SERVER_PORT = '5500';
    process.env.JWT_SECRET_KEY = 'abcdef';
    process.env.SENDGRID_API_KEY = 'SG.abcdef';
    process.env.SENDGRID_EMAIL = 'abc@def.com';

    const { default: appConfig } = proxyquire(
      '../../../src/config/app.config',
      {},
    );

    expect(appConfig).to.deep.equal({
      ENVIRONMENT: 'debug',
      PORT: 5500,
      JWT_SECRET_KEY: 'abcdef',
      SENDGRID_API_KEY: 'SG.abcdef',
      SENDGRID_EMAIL: 'abc@def.com',
    });
  });

  after(() => {
    delete process.env.NODE_ENV;
    delete process.env.SERVER_PORT;
    delete process.env.JWT_SECRET_KEY;
    delete process.env.SENDGRID_API_KEY;
    delete process.env.SENDGRID_EMAIL;
  });
});
