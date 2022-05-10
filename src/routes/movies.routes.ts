import { Service } from 'typedi';
import MoviesController from '../controllers/movies.controller';
import authenticateJwt from '../middlewares/authenticate-jwt.middleware';
import validateRequest from '../middlewares/validate-request.middleware';
import CreateMovieDto from '../models/dto/movies/create-movie.dto';
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
  }
}
