/**
 * Gets the app config from environment variables.
 */
const appConfig = {
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  PORT: process.env.SERVER_PORT ? Number(process.env.SERVER_PORT) : 3000,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY || 'default',
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY || '',
  SENDGRID_EMAIL: process.env.SENDGRID_EMAIL || '',
};

export default appConfig;
