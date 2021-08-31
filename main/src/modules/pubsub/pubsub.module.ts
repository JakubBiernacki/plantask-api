import { Global, Module } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { Providers } from '../../constants';

@Global()
@Module({
  providers: [
    {
      provide: Providers.PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [Providers.PUB_SUB],
})
export class PubSubModule {}
