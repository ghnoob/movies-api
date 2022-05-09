import { instanceToPlain } from 'class-transformer';
import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import CharactersService from './services/characters.service';

@Service()
export default class CharactersController {
  constructor(private readonly service: CharactersService) {}

  /**
   * Returns a paginated list of characters.
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
   * Returns the details of a character.
   */
  async findOne(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const character = await this.service.findOne(Number(req.params.id));

      if (character) {
        return res
          .status(HttpStatus.OK)
          .json(instanceToPlain(character, { excludeExtraneousValues: true }));
      }

      return next(new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'));
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Creates a new character.
   */
  async create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const character = await this.service.create(req.body);

      return res.status(HttpStatus.CREATED).json({ id: character.id });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Updates an existing chartacter.
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
        return next(
          new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'),
        );
      }

      return res.status(HttpStatus.OK).json({ message: 'Character updated.' });
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Deletes a character.
   */
  async delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const deleted = await this.service.delete(Number(req.params.id));

      if (!deleted) {
        return next(
          new HttpError(HttpStatus.NOT_FOUND, 'Character not found.'),
        );
      }

      return res.status(HttpStatus.OK).json({ message: 'Character deleted.' });
    } catch (err) {
      return next(err);
    }
  }
}
