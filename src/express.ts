import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import swaggerJSDoc from 'swagger-jsdoc';
import { setup, serve } from 'swagger-ui-express';
import errorHandler from './middlewares/error-handler.middleware';
import errorLogger from './middlewares/error-logger.middleware';
import fallbackErrorTransformer from './middlewares/fallback-error-transformer.middleware';
import requestLogger from './middlewares/request-logger.middleware';
import swaggerConfig from './config/swagger.config';

const app = express();

app.use(express.json());
app.use(cors());
app.use(helmet());

app.use('/api', serve, setup(swaggerJSDoc(swaggerConfig)));

app.use(requestLogger);

// routes go here

app.use(errorLogger);

app.use(fallbackErrorTransformer);

app.use(errorHandler);

export default app;
