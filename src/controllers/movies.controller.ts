import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
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
}
