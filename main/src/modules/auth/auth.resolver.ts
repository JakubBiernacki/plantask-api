import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthenticationError } from 'apollo-server-express';
import { LoginResult } from './entities/login-result.entity';
import * as dayjs from 'dayjs';
import { ForbiddenException } from '@nestjs/common';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Mutation(() => LoginResult)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const result = await this.authService.validateUser(loginInput);

    if (result) return result;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }

  @Mutation(() => LoginResult)
  async refreshToken(@Args('refreshToken') refreshToken: string) {
    const token = await this.authService.findByToken(refreshToken);
    const valid = dayjs(token?.expiresOn).isAfter(dayjs());

    if (!token || !valid) {
      throw new ForbiddenException();
    }

    token.deleteOne();

    return this.authService.getAccessToken(token.user);
  }
}
