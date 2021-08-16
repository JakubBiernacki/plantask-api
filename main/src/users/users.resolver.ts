import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { BaseResolver } from '../common/resolvers/base.resolver';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(private usersService: UsersService) {
    super(usersService);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  me(@GetUser() user: User) {
    return user;
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }
}
