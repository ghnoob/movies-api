import { expect, use } from 'chai';
import { createStubInstance, SinonStubbedInstance, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import CharactersController from '../../../src/controllers/characters.controller';
import CharactersService from '../../../src/controllers/services/characters.service';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('characters controller tests', () => {
  const res = mockRes(),
    next = stub();

  let controller: CharactersController,
    service: SinonStubbedInstance<CharactersService>;

  beforeEach(() => {
    service = createStubInstance(CharactersService);

    controller = new CharactersController(service);
  });

  afterEach(() => {
    res.status.resetHistory();
    res.json.resetHistory();
    next.resetHistory();
  });

  describe('findAll', () => {
    const query = { page: '1', limit: '1' };
    const req = mockReq({ query });

    afterEach(() => {
      service.findAll.reset();
    });

    it('should return characters list', async () => {
      const paginationResult = { data: [], totalPages: 0, total: 0 };
      service.findAll.resolves(paginationResult);

      await controller.findAll(req, res, next);

      expect(service.findAll).to.have.been.calledOnceWithExactly(query);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).to.have.been.calledOnceWithExactly(paginationResult);
    });

    it('should call next middleware on error', async () => {
      const err = new Error();
      service.findAll.rejects(err);

      await controller.findAll(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });
});
