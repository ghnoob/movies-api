import { join } from 'path';
import { Options } from 'swagger-jsdoc';

/**
 * Swagger options.
 */
const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'movies-api',
      version: '1.0.0',
      description: "REST API made for Alkemy's Node.js Backend Challenge.",
      license: {
        name: 'GPL 3.0',
        url: 'https://www.gnu.org/licenses/gpl-3.0.txt',
      },
    },
  },
  apis: [
    join(__dirname, '..', 'controllers', '*.controller.ts'),
    join(__dirname, '..', 'errors', '*.error.ts'),
    join(__dirname, '..', 'middlewares', '*.middleware.ts'),
    join(__dirname, '..', 'models', '*.model.ts'),
    join(__dirname, '..', 'models', 'dto', '**', '*.dto.ts'),
    join(__dirname, '..', 'routes', '*.routes.ts'),
  ],
};

export default swaggerConfig;
