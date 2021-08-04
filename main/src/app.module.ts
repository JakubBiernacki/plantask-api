import { Module } from '@nestjs/common';
import { TasksModule } from './tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongoose.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfig } from './config/graphql.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    GraphQLModule.forRootAsync({
      useClass: GqlConfig,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useClass: MongooseConfig,
    }),
    TasksModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
