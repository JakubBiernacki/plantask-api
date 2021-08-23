import { registerAs } from '@nestjs/config';

export const MongooseConfig = registerAs('mongoose', () => ({
  uri: process.env.DB_URL,
  useFindAndModify: false,
  connectionName: 'main',
  useCreateIndex: true,
}));
