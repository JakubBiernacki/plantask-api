import { registerAs } from '@nestjs/config';

export const GqlConfig = registerAs('graphql', () => ({
  autoSchemaFile: '../schema.gql',
  playground: true,
  debug: false,
}));
