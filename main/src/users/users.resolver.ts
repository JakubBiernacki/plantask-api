import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { BaseResolver } from '../common/resolvers/base.resolver';
import { Company } from '../companies/entities/company.entity';
import { CompaniesService } from '../companies/companies.service';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
  ) {
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

  @ResolveField('company', () => Company, { nullable: true })
  getCompany(@Parent() user: User) {
    const { company } = user;
    return this.companiesService.findOne(company);
  }
}
