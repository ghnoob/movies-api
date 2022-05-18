/**
 * @swagger
 * paths:
 *   /movies:
 *     get:
 *       tags:
 *         - movies
 *       operationId: getAllMovies
 *       summary: Get all movies
 *       parameters:
 *         - in: query
 *           name: page
 *           schema:
 *             type: integer
 *             minimum: 1
 *             default: 1
 *             description: Page number of the paginated result
 *         - in: query
 *           name: limit
 *           schema:
 *             type: integer
 *             minimum: 1
 *             maximum: 50
 *             default: 50
 *             description: Maximum number of items per page
 *         - in: query
 *           name: title
 *           schema:
 *             type: string
 *           description: Filter by title
 *         - in: query
 *           name: genre
 *           schema:
 *             type: integer
 *           description: Filter by genre id
 *         - in: query
 *           name: order
 *           schema:
 *             type: string
 *             enum:
 *               - ASC
 *               - DESC
 *             description: Sort by creation date, ascending or descending
 *             default: ASC
 *       responses:
 *         200:
 *           $ref: '#/components/responses/MovieList'
 *     post:
 *       tags:
 *         - movies
 *       security:
 *         - bearerAuth: []
 *       summary: Creates a new movie
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateMovieDto'
 *       responses:
 *         201:
 *           $ref: '#/components/responses/MovieCreated'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 *         422:
 *           $ref: '#/components/responses/InvalidGenreId'
 */

import { Service } from 'typedi';
import MoviesController from '../controllers/movies.controller';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import AddMovieCharacterDto from '../models/dto/movies/add-movie-character.dto';
import RemoveMovieCharacterDto from '../models/dto/movies/remove-movie-character.dto';
import CreateMovieDto from '../models/dto/movies/create-movie.dto';
import UpdateMovieDto from '../models/dto/movies/update-movie.dto';
import FilterMovieDto from '../models/dto/movies/filter-movie.dto';
import IdParamDto from '../models/dto/id-param.dto';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class MoviesRoutes extends CommonRoutes {
  constructor(private readonly controller: MoviesController) {
    super('/movies');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.get(
      '/',
      validateRequest(FilterMovieDto, 'query'),
      this.controller.findAll.bind(this.controller),
    );

    this.router.get(
      '/:id',
      validateRequest(IdParamDto, 'params'),
      this.controller.findOne.bind(this.controller),
    );

    this.router.post(
      '/',
      authenticateJwt,
      validateRequest(CreateMovieDto),
      this.controller.create.bind(this.controller),
    );

    this.router.patch(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      validateRequest(UpdateMovieDto),
      this.controller.update.bind(this.controller),
    );

    this.router.delete(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      this.controller.delete.bind(this.controller),
    );

    this.router.post(
      '/:id/characters',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      validateRequest(AddMovieCharacterDto),
      this.controller.addCharacter.bind(this.controller),
    );

    this.router.delete(
      '/:movieId/characters/:characterId',
      authenticateJwt,
      validateRequest(RemoveMovieCharacterDto, 'params'),
      this.controller.removeCharacter.bind(this.controller),
    );
  }
}
