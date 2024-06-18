import { Config } from './config.type';

export default (): Config => ({
  port: parseInt(process.env.PORT as string, 10) || 3000,
  jwt: {
    secret: process.env.JWT_SECRET as string,
    expiresIn: process.env.JWT_EXPIRES_IN as string,
  },
});
