import { Request, Response, NextFunction } from 'express';
import { Service } from 'typedi';
import HttpStatus from '../models/enums/http-status.enum';
import CharactersService from './services/characters.service';

@Service()
export default class CharactersController {
  constructor(private readonly service: CharactersService) {
    console.log(this.service);
  }

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
}
