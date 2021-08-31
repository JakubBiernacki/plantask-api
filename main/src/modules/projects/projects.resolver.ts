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
import { PaginationArgs } from '../../common/dto/pagination.args';
import { GetIdArgs } from '../../common/dto/getId.args';
import { BaseResolver } from '../../common/base/base.resolver';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/jwt-gqlAuth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ACCOUNT_Types } from '../../common/decorators/account-type.decorator';
import { AccountType } from '../users/enums/accountType.enum';
import { AccountTypeGuard } from '../../common/guards/account-type.guard';
import { Organization } from '../organizations/entities/organization.entity';
import { ProjectInOrganizationGuard } from '../../common/guards/in-organization/project-in-organization.guard';

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver extends BaseResolver(Project) {
  constructor(
    private projectsService: ProjectsService,
    private usersService: UsersService,
  ) {
    super(projectsService);
  }

  @UseGuards(ProjectInOrganizationGuard)
  @Query(() => Project, { name: `findOne${Project.name}` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @ACCOUNT_Types(AccountType.Normal, AccountType.Organizer)
  @UseGuards(AccountTypeGuard)
  @Mutation(() => Project)
  async createProject(
    @CurrentUser() user,
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ) {
    createProjectInput.created_by = user;
    createProjectInput.organization = user?.organization;
    createProjectInput.users = [user];

    return this.projectsService.create(createProjectInput);
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(ProjectInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Project)
  async addProjectContributors(
    @Args() { id }: GetIdArgs,
    @Args({ name: 'contributors', type: () => [String] })
    contributors: string[],
  ) {
    const project = await this.projectsService.findOne(id);

    const newContributors = await Promise.all(
      contributors.map((userId) => this.usersService.findOne(userId)),
    );

    newContributors.forEach((user: User & any) => {
      if (project.users.includes(user.id)) {
        throw new BadRequestException(
          `user ${user.username} is already a collaborator`,
        );
      }
      if (
        !user?.organization ||
        !user.organization.equals(project.organization)
      ) {
        throw new BadRequestException(
          `user ${user.username} is not in organization`,
        );
      }
    });

    return this.projectsService.addContributors(id, newContributors);
  }

  @ACCOUNT_Types(AccountType.Normal, AccountType.Organizer)
  @UseGuards(ProjectInOrganizationGuard, AccountTypeGuard)
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
  @UseGuards(ProjectInOrganizationGuard, AccountTypeGuard)
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

  @ResolveField('created_by', () => User)
  getCreator(@Parent() project: Project) {
    return this.projectsService.getCreatorByProject(project);
  }

  @ResolveField('organization', () => Organization, { nullable: true })
  getOrganization(@Parent() project: Project) {
    return this.projectsService.getOrganizationByProject(project);
  }

  @ResolveField('users', () => [User])
  getUsers(@Parent() project: Project) {
    return this.projectsService.getUsersByProject(project);
  }
}
