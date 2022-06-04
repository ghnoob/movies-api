import { expect, use } from 'chai';
import { createStubInstance, match, SinonStubbedInstance, stub } from 'sinon';
import sinonChai from 'sinon-chai';
import { mockReq, mockRes } from 'sinon-express-mock';
import { ForeignKeyConstraintError } from 'sequelize';
import Movie from '../../../src/models/movie.model';
import MoviesController from '../../../src/controllers/movies.controller';
import MoviesService from '../../../src/controllers/services/movies.service';
import Genre from '../../../src/models/genre.model';
import HttpError from '../../../src/errors/http.error';
import HttpStatus from '../../../src/models/enums/http-status.enum';

use(sinonChai);

describe('movies controller tests', () => {
  const res = mockRes(),
    next = stub();

  let controller: MoviesController,
    service: SinonStubbedInstance<MoviesService>;

  const mockMovie = createStubInstance(Movie);
  mockMovie.id = 1;
  mockMovie.title = 'The Lion King';
  mockMovie.genreId = 1;
  mockMovie.genre = createStubInstance(Genre);
  mockMovie.genre.id = 1;
  mockMovie.genre.name = 'Drama';
  mockMovie.createdAt = new Date('2022-01-01T00:00:00.000Z');
  mockMovie.characters = [];

  beforeEach(() => {
    service = createStubInstance(MoviesService);

    controller = new MoviesController(service);
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

    it('should return movies list', async () => {
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

  describe('findOne', () => {
    const params = { id: '1' };
    const req = mockReq({ params });

    afterEach(() => {
      service.findOne.reset();
    });

    it('should return a movie', async () => {
      service.findOne.resolves(mockMovie);

      await controller.findOne(req, res, next);

      expect(service.findOne).to.have.been.calledOnceWithExactly(1);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.OK);
      expect(res.json).callCount(1);
      expect(res.json).to.have.been.calledWithMatch({
        id: 1,
        title: 'The Lion King',
        genre: {
          id: 1,
          name: 'Drama',
        },
        createdAt: match.date,
        characters: [],
      });
    });

    it('should call next with 404 error', async () => {
      service.findOne.resolves(null);

      await controller.findOne(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.NOT_FOUND)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.findOne.rejects(err);

      await controller.findOne(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });

  describe('create', () => {
    const body = { title: 'The Lion King', genreId: 1 };
    const req = mockReq({ body });

    afterEach(() => {
      service.create.reset();
    });

    it('should return id of the created movie', async () => {
      service.create.resolves(mockMovie);

      await controller.create(req, res, next);

      expect(service.create).to.have.been.calledOnceWithExactly(body);
      expect(res.status).to.have.been.calledOnceWithExactly(HttpStatus.CREATED);
      expect(res.json).to.have.been.calledOnceWithExactly({ id: 1 });
    });

    it('should return 422 error on bad genre id', async () => {
      service.create.rejects(new ForeignKeyConstraintError({}));

      await controller.create(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(
        match
          .instanceOf(HttpError)
          .and(match.has('status', HttpStatus.UNPROCESSABLE_ENTITY)),
      );
    });

    it('should call next with error', async () => {
      const err = new Error();
      service.create.rejects(err);

      await controller.create(req, res, next);

      expect(next).to.have.been.calledOnceWithExactly(err);
    });
  });
});
