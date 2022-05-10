import { Service } from 'typedi';
import MoviesController from '../controllers/movies.controller';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import AddMovieCharacterDto from '../models/dto/movies/add-movie-character.dto';
import RemoveMovieCharacterDto from '../models/dto/movies/remove-movie-character.dto';
import CreateMovieDto from '../models/dto/movies/create-movie.dto';
import UpdateMovieDto from '../models/dto/movies/update-movie.dto';
import IdParamDto from '../models/dto/id-param.dto';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class MoviesRoutes extends CommonRoutes {
  constructor(private readonly controller: MoviesController) {
    super('/movies');
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
