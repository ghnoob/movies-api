/**
 * Gets the app config from environment variables.
 */
const appConfig = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
};

export default appConfig;
