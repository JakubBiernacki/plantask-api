import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ProjectsService } from './projects.service';
import { Project } from './entities/project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { Task } from '../tasks/entities/task.entity';
import { PaginationArgs } from '../common/dto/pagination.args';
import { GetIdArgs } from '../common/dto/getId.args';
import { BaseResolver } from '../common/resolvers/base.resolver';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { InOrganizationGuard } from '../auth/guards/inOrganization.guard';
import { ACCOUNT_Types } from '../auth/decorators/accountType.decorator';
import { AccountType } from '../users/enums/accountType.enum';
import { AccountTypeGuard } from '../auth/guards/accountType.guard';
import { Company } from '../companies/entities/company.entity';
import { CompaniesService } from '../companies/companies.service';

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver extends BaseResolver(Project) {
  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
    private companiesService: CompaniesService,
  ) {
    super(projectsService);
  }

  @UseGuards(InOrganizationGuard)
  @Query(() => Project, { name: `findOne${Project.name}` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @ACCOUNT_Types(AccountType.Normal, AccountType.Organizer)
  @UseGuards(AccountTypeGuard)
  @Mutation(() => Project)
  createProject(
    @GetUser() user,
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ) {
    createProjectInput.created_by = user;
    createProjectInput.company = user?.company;
    return this.projectsService.create(createProjectInput);
  }

  @ACCOUNT_Types(AccountType.Normal, AccountType.Organizer)
  @UseGuards(InOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectsService.update(
      updateProjectInput.id,
      updateProjectInput,
    );
  }

  @ACCOUNT_Types(AccountType.Normal, AccountType.Organizer)
  @UseGuards(InOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Project)
  removeProject(@Args() { id }: GetIdArgs) {
    return this.projectsService.remove(id);
  }

  @ResolveField('tasks', () => [Task])
  getTasks(@Parent() project: Project, @Args() pagination: PaginationArgs) {
    const { limit, offset } = pagination;
    return this.projectsService
      .getTasksByProjectId(project)
      .limit(limit)
      .skip(offset);
  }

  @ResolveField('creator', () => User)
  getCreator(@Parent() project: Project) {
    const { created_by } = project;
    return this.usersService.findOne(created_by);
  }

  @ResolveField('company', () => Company, { nullable: true })
  getCompany(@Parent() project: Project) {
    const { company } = project;
    return this.companiesService.findOne(company);
  }
}
