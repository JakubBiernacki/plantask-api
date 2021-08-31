import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';

import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { AuthResolver } from './auth.resolver';
import { JwtConfig } from '../../config/jwt.config';
import { MongooseModule } from '@nestjs/mongoose';

import { Token, TokenSchema } from './entities/token.entity';

@Module({
  imports: [
    ConfigModule,
    // UsersModule,
    forwardRef(() => UsersModule),
    PassportModule,
    ConfigModule.forFeature(JwtConfig),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(JwtConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get('jwt.secret'),
        signOptions: {
          expiresIn: `${configService.get<number>('jwt.expiresIn')}s`,
        },
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: Token.name, schema: TokenSchema }]),
  ],
  providers: [AuthService, JwtStrategy, AuthResolver],
  exports: [AuthService],
})
export class AuthModule {}
