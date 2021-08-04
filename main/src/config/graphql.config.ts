import { GqlModuleOptions, GqlOptionsFactory } from '@nestjs/graphql';

export class GqlConfig implements GqlOptionsFactory {
  createGqlOptions(): GqlModuleOptions {
    return {
      debug: false,
      playground: true,
      autoSchemaFile: '../schema.gql',
    };
  }
}
