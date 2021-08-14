import { Args, Query, Resolver } from '@nestjs/graphql';
import { AuthService } from './auth.service';
import { LoginInput } from './dto/login.input';
import { AuthenticationError } from 'apollo-server-express';
import { LoginResult } from './models/login-result.model';

@Resolver()
export class AuthResolver {
  constructor(private authService: AuthService) {}

  @Query(() => LoginResult)
  async login(@Args('loginInput') loginInput: LoginInput) {
    const result = await this.authService.validateUser(loginInput);

    if (result) return result;
    throw new AuthenticationError(
      'Could not log-in with the provided credentials',
    );
  }
}
