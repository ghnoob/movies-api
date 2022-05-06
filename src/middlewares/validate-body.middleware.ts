import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';

/**
 * Middleware for validating the request body.
 * @param c Class to validate the body against.
 * @param [whitelist=true] if set to true (default), the validator will strip the properties
 * not defined in the validator class from the request body.
 *
 * If the validation was successful, `req.body` will be set to an instance of the validator class.
 * Else it will pass thw validation error to the error handler.
 */
export default function validateBody(
  c: ClassConstructor<object>,
  whitelist = true,
) {
  return async function transformAndValidate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const toValidate = plainToInstance(c, req.body ?? {}, {
      exposeUnsetFields: false,
      excludeExtraneousValues: true,
    });

    const validationErrors = await validate(toValidate, { whitelist });

    if (validationErrors.length > 0) {
      const error = new HttpError(HttpStatus.BAD_REQUEST, {
        description: 'Validation error.',
        errors: validationErrors.flatMap((err) =>
          Object.values(err.constraints as Record<string, string>),
        ),
      });
      return next(error);
    }

    req.body = toValidate;

    return next();
  };
}
