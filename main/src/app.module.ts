import { Module } from '@nestjs/common';
import { TasksModule } from './modules/tasks/tasks.module';
import { MongooseModule } from '@nestjs/mongoose';
import { MongooseConfig } from './config/mongoose.config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { GqlConfig } from './config/graphql.config';
import { ProjectsModule } from './modules/projects/projects.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '../.env',
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(GqlConfig)],
      useFactory: async (configService: ConfigService) =>
        configService.get('graphql'),
      inject: [ConfigService],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule.forFeature(MongooseConfig)],
      useFactory: async (configService: ConfigService) =>
        configService.get('mongoose'),
      inject: [ConfigService],
    }),
    TasksModule,
    ProjectsModule,
    UsersModule,
    AuthModule,
    OrganizationsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
