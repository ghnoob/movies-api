import { expect, use } from 'chai';
import { col, fn, literal, Op, where } from 'sequelize';
import { createSandbox, match, SinonSandbox, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import CharactersService from '../../../../src/controllers/services/characters.service';
import Character from '../../../../src/models/character.model';
import FilterCharacterDto from '../../../../src/models/dto/characters/filter-character.dto';

use(sinonChai);

describe('characters service tests', () => {
  let service: CharactersService, sandbox: SinonSandbox;

  before(() => {
    service = new CharactersService();
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    let mockFindAndCountAll: SinonStub;

    beforeEach(() => {
      mockFindAndCountAll = sandbox
        .stub(Character, 'findAndCountAll')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .resolves({ rows: [], count: 0 as any }); // overload does not work
    });

    it('dto has all possible parameters', async () => {
      const dto: FilterCharacterDto = {
        limit: '1',
        page: '1',
        name: 'simba',
        age: { gt: 3 },
        weight: { lt: 200 },
        movies: [1],
      };

      expect(await service.findAll(dto)).to.deep.equal({
        data: [],
        total: 0,
        totalPages: 0,
      });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 1,
        offset: 0,
        where: { [Op.and]: match.array },
      });

      const conditions = (
        mockFindAndCountAll.getCall(0).args[0].where as { [Op.and]: object }
      )[Op.and];

      expect(conditions).to.have.deep.members([
        where(fn('to_tsvector', col('name')), {
          [Op.match]: fn('plainto_tsquery', dto.name),
        }),
        { age: { [Op.and]: [{ [Op.gt]: 3 }, { [Op.not]: null }] } },
        { weight: { [Op.and]: [{ [Op.lt]: 200 }, { [Op.not]: null }] } },
        {
          id: {
            [Op.in]: literal(`(
          SELECT "characterId" FROM "movies-characters"
          WHERE "movieId" IN ( 1 )
        )`),
          },
        },
      ]);
    });

    it('empty parameters', async () => {
      await service.findAll({});

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 50,
        offset: 0,
        where: { [Op.and]: [] },
      });
    });
  });

  describe('findOne', () => {
    it('should call findByPk with the correct parameter', async () => {
      const mockFindByPk = sandbox.stub(Character, 'findByPk').resolves(null);

      expect(await service.findOne(1)).to.be.null;

      expect(mockFindByPk).to.have.been.calledOnceWith(1);
    });
  });
});
