/**
 * @swagger
 * components:
 *   responses:
 *     ValidationError:
 *       description: Validation error.
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HttpError'
 *           example:
 *             statusCode: 400
 *             name: Bad Request
 *             errors:
 *               - example validation error
 */

import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { Request, Response, NextFunction } from 'express';
import HttpError from '../errors/http.error';
import HttpStatus from '../models/enums/http-status.enum';

type RequestField = 'body' | 'params' | 'query';

/**
 * Middleware for validating the request.
 * @param c Class to validate the field against.
 * @param field Request field to validate. Default 'body'
 * @param whitelist if set to true (default), the validator will strip the properties
 * not defined in the validator class from the request field.
 *
 * If the validation was successful, the field will be set to an instance of the validator class.
 * Else it will pass thw validation error to the error handler.
 */
export default function validateRequest(
  c: ClassConstructor<object>,
  field: RequestField = 'body',
  whitelist = true,
) {
  return async function transformAndValidate(
    req: Request,
    _res: Response,
    next: NextFunction,
  ) {
    const toValidate = plainToInstance(c, req[field] ?? {}, {
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

    req[field] = toValidate;

    return next();
  };
}
