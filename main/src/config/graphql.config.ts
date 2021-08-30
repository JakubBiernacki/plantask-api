import { registerAs } from '@nestjs/config';

export const GqlConfig = registerAs('graphql', () => ({
  autoSchemaFile: '../schema.gql',
  playground: true,
  debug: false,
  installSubscriptionHandlers: true,
  // context: ({ req, res, connection }) => ({ req, res }),
  context: ({ req, connection }) =>
    connection ? { req: { headers: connection.context } } : { req },
}));
