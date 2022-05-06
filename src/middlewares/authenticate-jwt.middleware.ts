import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import '../auth/jwt.strategy';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';
import User from '../models/user.model';

/**
 * passport-jwt strategy with custom responses.
 */
function authenticateJwt(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  passport.authenticate('jwt', { session: false }, async (err, user) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return next(
        new HttpError(HttpStatus.UNAUTHORIZED, 'Invalid authentication token'),
      );
    }

    /**
     * Checks if user exists in the database.
     * In case of the token of a deleted user being used.
     */
    if (!(await User.findByPk(user.id, { attributes: ['id'] }))) {
      return next(new HttpError(HttpStatus.NOT_FOUND, 'User not found.'));
    }

    req.user = user;

    return next();
  })(req, res, next);
}

export default authenticateJwt;
