/**
 * Gets the app config from environment variables.
 */
const appConfig = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'default',
};

export default appConfig;
