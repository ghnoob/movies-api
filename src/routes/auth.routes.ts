import passport from 'passport';
import { Service } from 'typedi';
import '../auth/local.strategy';
import AuthController from '../controllers/auth.controller';
import LoginDto from '../models/dto/auth/login.dto';
import RegisterDto from '../models/dto/auth/register.dto';
import validateRequest from '../middlewares/validate-body.middleware';
import CommonRoutes from './common.routes';

@Service({ id: 'routes', multiple: true })
export default class AuthRoutes extends CommonRoutes {
  constructor(private readonly controller: AuthController) {
    super('/auth');
    this.setUpRoutes();
  }

  protected setUpRoutes() {
    this.router.post(
      '/register',
      validateRequest(RegisterDto),
      passport.authenticate('register', { session: false }),
      this.controller.register,
    );
    this.router.post(
      '/login',
      validateRequest(LoginDto),
      passport.authenticate('login', { session: false }),
      this.controller.login,
    );
  }
}
