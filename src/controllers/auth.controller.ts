import { Request, Response, NextFunction } from 'express';
import { sign } from 'jsonwebtoken';
import { Service } from 'typedi';
import appConfig from '../config/app.config';
import HttpStatus from '../models/enums/http-status.enum';

/**
 * Controller for auth routes.
 */
@Service()
export default class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    return res.status(HttpStatus.CREATED).json({ user: req.user });
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<Response | void> {
    try {
      const token = await sign({ user: req.user }, appConfig.JWT_SECRET_KEY);

      return res.status(HttpStatus.OK).json({ token });
    } catch (err) {
      return next(err);
    }
  }
}
