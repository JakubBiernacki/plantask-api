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
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { GetIdArgs } from '../common/dto/getId.args';
import { UserInOrganizationGuard } from './guards/userInOrganization.guard';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(
    private usersService: UsersService,
    private companiesService: CompaniesService,
    private projectsService: ProjectsService,
  ) {
    super(usersService);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  me(@GetUser() user: User) {
    return user;
  }

  @UseGuards(GqlAuthGuard, UserInOrganizationGuard)
  @Query(() => User, { name: `findOneUser` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
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

  @ResolveField('projects', () => [Project], { nullable: true })
  getProjects(@Parent() user: User) {
    return this.projectsService.getProjectsByUserId(user);
  }
}
