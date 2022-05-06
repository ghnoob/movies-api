import { Service } from 'typedi';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateBody from '../middlewares/validate-body.middleware';
import CharactersController from '../controllers/characters.controller';
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
    this.router.post(
      '/',
      authenticateJwt,
      validateBody(CreateCharacterDto),
      this.controller.create.bind(this.controller),
    );

    this.router.patch(
      '/:id',
      authenticateJwt,
      validateBody(UpdateCharacterDto),
      this.controller.update.bind(this.controller),
    );

    this.router.delete(
      '/:id',
      authenticateJwt,
      this.controller.delete.bind(this.controller),
    );
  }
}
