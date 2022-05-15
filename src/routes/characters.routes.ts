/**
 * @swagger
 * paths:
 *   /characters:
 *     get:
 *       tags:
 *         - characters
 *       summary: Get all characters
 *       parameters:
 *         - in: query
 *           name: name
 *           schema:
 *             type: string
 *           description: Filter by name
 *         - in: query
 *           name: age
 *           schema:
 *             oneOf:
 *               - type: integer
 *               - $ref: '#/components/schemas/NumericFilter'
 *           description: >
 *             Filter by age. Can be an integer to just search for characters whose age equals the
 *             input value or an object as indicated in the `NumericFilter` schema to specify ranges.
 *         - in: query
 *           name: weight
 *           schema:
 *             oneOf:
 *               - type: integer
 *               - $ref: '#/components/schemas/NumericFilter'
 *           description: >
 *             Filter by weight. Can be an integer to just search for characters whose weight equals the
 *             input value or an object as indicated in the `NumericFilter` schema to specify ranges.
 *         - in: query
 *           name: movies
 *           schema:
 *             type: array
 *             items:
 *               type: integer
 *           description: >
 *             Filter by movies (using their ids) where the characters appeared.
 *             If more than one movie id is supplied, it will select characters who appeared
 *             in at least one of those movies
 *       responses:
 *         200:
 *           $ref: '#/components/responses/CharacterList'
 *
 *     post:
 *       tags:
 *         - characters
 *       summary: Creates a new character
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CreateCharacterDto'
 *       responses:
 *         201:
 *           $ref: '#/components/responses/CharacterCreated'
 *         400:
 *           $ref: '#/components/responses/ValidationError'
 *         401:
 *           $ref: '#/components/responses/Unauthorized'
 */

import { Service } from 'typedi';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import CharactersController from '../controllers/characters.controller';
import IdParamDto from '../models/dto/id-param.dto';
import CreateCharacterDto from '../models/dto/characters/create-character.dto';
import FilterCharacterDto from '../models/dto/characters/filter-character.dto';
import UpdateCharacterDto from '../models/dto/characters/update-character.dto';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class CharactersRoutes extends CommonRoutes {
  constructor(private readonly controller: CharactersController) {
    super('/characters');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.get(
      '/',
      validateRequest(FilterCharacterDto, 'query'),
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
      validateRequest(CreateCharacterDto),
      this.controller.create.bind(this.controller),
    );

    this.router.patch(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      validateRequest(UpdateCharacterDto),
      this.controller.update.bind(this.controller),
    );

    this.router.delete(
      '/:id',
      authenticateJwt,
      validateRequest(IdParamDto, 'params'),
      this.controller.delete.bind(this.controller),
    );
  }
}
