import { Service } from 'typedi';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import CharactersController from '../controllers/characters.controller';
import IdParamDto from '../models/dto/id-param.dto';
import CreateCharacterDto from '../models/dto/characters/create-character.dto';
import UpdateCharacterDto from '../models/dto/characters/update-character.dto';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class CharactersRoutes extends CommonRoutes {
  constructor(private readonly controller: CharactersController) {
    super('/characters');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.get('/', this.controller.findAll.bind(this.controller));

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
