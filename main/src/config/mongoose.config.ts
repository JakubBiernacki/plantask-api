import { Injectable } from '@nestjs/common';
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongooseConfig implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {
    console.log(configService.get('db'));
  }
  createMongooseOptions(): MongooseModuleOptions {
    return {
      uri: 'mongodb://localhost/nest',
    };
  }
}
