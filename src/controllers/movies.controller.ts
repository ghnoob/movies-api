import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
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
}
