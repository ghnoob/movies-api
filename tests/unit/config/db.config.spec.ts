import { expect } from 'chai';
import { noPreserveCache } from 'proxyquire';
import { stub } from 'sinon';

const proxyquire = noPreserveCache();

describe('db config tests', () => {
  it('should use default config', () => {
    const dbConfig = proxyquire('../../../src/config/db.config', {
      logger: {
        default: {
          debug: stub().returns(() => 'test'),
        },
      },
    });

    expect(dbConfig).to.have.property('host', 'postgres');
    expect(dbConfig).to.have.property('port', 5432);
    expect(dbConfig).to.have.property('database', 'movies-api');
    expect(dbConfig).to.have.property('username', 'postgres');
    expect(dbConfig).to.have.property('password', 'admin');
  });

  it('should use provided env variables', () => {
    process.env.DB_HOST = 'localhost';
    process.env.DB_PORT = '5433';
    process.env.DB_NAME = 'abcdef';
    process.env.DB_USER = 'user';
    process.env.DB_PASS = 'password';

    const dbConfig = proxyquire('../../../src/config/db.config', {
      logger: {
        default: {
          debug: stub().returns(() => 'test'),
        },
      },
    });

    expect(dbConfig).to.have.property('host', 'localhost');
    expect(dbConfig).to.have.property('port', 5433);
    expect(dbConfig).to.have.property('database', 'abcdef');
    expect(dbConfig).to.have.property('username', 'user');
    expect(dbConfig).to.have.property('password', 'password');
  });

  after(() => {
    delete process.env.DB_HOST;
    delete process.env.DB_PORT;
    delete process.env.DB_NAME;
    delete process.env.DB_USER;
    delete process.env.DB_PASS;
  });
});
