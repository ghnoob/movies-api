import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { ForeignKeyConstraintError, UniqueConstraintError } from 'sequelize';
import { Service } from 'typedi';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import MoviesService from './services/movies.service';

@Service()
export default class MoviesController {
  constructor(private readonly service: MoviesService) {}

  /**
   * Returns all the movies.
   */
  async findAll(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const result = await this.service.findAll(req.query);

      return res
        .status(HttpStatus.OK)
        .json(instanceToPlain(result, { excludeExtraneousValues: true }));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Returns the details of a movie.
   */
  async findOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const movie = await this.service.findOne(Number(req.params.id));

      if (movie) {
        return res
          .status(HttpStatus.OK)
          .json(instanceToPlain(movie, { excludeExtraneousValues: true }));
      }

      return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a new movie.
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const movie = await this.service.create(req.body);

      return res.status(HttpStatus.CREATED).json({ id: movie.id });
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Genre with id ${req.body.genreId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }

  /**
   * Updates an existing movie.
   */
  async update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const updated = await this.service.update(
        Number(req.params.id),
        req.body,
      );

      if (!updated) {
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      return res.status(HttpStatus.OK).json({ message: 'Movie updated.' });
    } catch (err) {
      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Genre with id ${req.body.genreId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }

  /**
   * Deletes a movie.
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const deleted = await this.service.delete(Number(req.params.id));

      if (!deleted) {
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      return res.status(HttpStatus.OK).json({ message: 'Movie deleted.' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Adds a character to a movie
   */
  async addCharacter(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      if (!(await this.service.exists({ id: Number(req.params.id) }))) {
        return next(new HttpError(HttpStatus.NOT_FOUND, 'Movie not found.'));
      }

      await this.service.addCharacter(Number(req.params.id), req.body);
      return res
        .status(HttpStatus.OK)
        .json({ message: 'Character added to movie' });
    } catch (err) {
      if (err instanceof UniqueConstraintError) {
        return next(
          new HttpError(
            HttpStatus.CONFLICT,
            'The character is already added to the movie.',
          ),
        );
      }

      if (err instanceof ForeignKeyConstraintError) {
        return next(
          new HttpError(
            HttpStatus.UNPROCESSABLE_ENTITY,
            `Character with id ${req.body.characterId} does not exist.`,
          ),
        );
      }

      return next(err);
    }
  }
}