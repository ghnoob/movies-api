import { expect, use } from 'chai';
import { col, fn, Op, where } from 'sequelize';
import { createSandbox, match, SinonSandbox, SinonStub } from 'sinon';
import sinonChai from 'sinon-chai';
import MoviesService from '../../../../src/controllers/services/movies.service';
import FilterMovieDto from '../../../../src/models/dto/movies/filter-movie.dto';
import Movie from '../../../../src/models/movie.model';

use(sinonChai);

describe('movies service tests', () => {
  let service: MoviesService, sandbox: SinonSandbox;

  before(() => {
    service = new MoviesService();
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('findAll', () => {
    let mockFindAndCountAll: SinonStub;

    beforeEach(() => {
      mockFindAndCountAll = sandbox
        .stub(Movie, 'findAndCountAll')
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .resolves({ rows: [], count: 0 as any });
    });

    it('using all filter parameters', async () => {
      const dto: FilterMovieDto = {
        page: '3',
        limit: '5',
        order: 'DESC',
        genre: 1,
        title: 'star wars',
      };

      expect(await service.findAll(dto)).to.deep.equal({
        data: [],
        total: 0,
        totalPages: 0,
      });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 5,
        offset: 10,
        order: [['createdAt', 'DESC']],
        where: { [Op.and]: match.array },
      });

      const conditions = (
        mockFindAndCountAll.getCall(0).args[0].where as { [Op.and]: object }
      )[Op.and];

      expect(conditions).to.have.deep.members([
        where(fn('to_tsvector', col('title')), {
          [Op.match]: fn('plainto_tsquery', 'star wars'),
        }),
        { genreId: 1 },
      ]);
    });

    it('empty parameters', async () => {
      await service.findAll({ order: 'ASC' });

      expect(mockFindAndCountAll).to.have.been.calledOnce;
      expect(mockFindAndCountAll).to.have.been.calledWithMatch({
        limit: 50,
        offset: 0,
        order: [['createdAt', 'ASC']],
        where: { [Op.and]: [] },
      });
    });
  });
});
