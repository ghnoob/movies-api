import { Router } from 'express';

/**
 * Defines properties common to all route classes.
 */
export default abstract class CommonRoutes {
  private basePath: string;
  protected router: Router;

  public constructor(basePath = '') {
    this.basePath = basePath;
    this.router = Router();
  }

  /**
   * Adds routes to express router.
   */
  protected abstract setUpRoutes(): void;

  /**
   * Gets Express router
   */
  public getRouter() {
    return this.router;
  }

  /**
   * Gets roter's base path.
   */
  public getBasePath() {
    return this.basePath;
  }
}
