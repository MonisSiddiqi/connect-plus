export type Config = {
  port: number;
  jwt: {
    secret: string,
    expiresIn: string,
  }
};
