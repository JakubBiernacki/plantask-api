import {
  Args,
  Mutation,
  Parent,
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

@Resolver(() => Project)
@UseGuards(GqlAuthGuard)
export class ProjectsResolver extends BaseResolver(Project) {
  constructor(
    private readonly projectsService: ProjectsService,
    private usersService: UsersService,
  ) {
    super(projectsService);
  }

  @Mutation(() => Project)
  createProject(
    @GetUser() user,
    @Args('createProjectInput') createProjectInput: CreateProjectInput,
  ) {
    createProjectInput.created_by = user;
    return this.projectsService.create(createProjectInput);
  }

  @Mutation(() => Project)
  updateProject(
    @Args('updateProjectInput') updateProjectInput: UpdateProjectInput,
  ) {
    return this.projectsService.update(
      updateProjectInput.id,
      updateProjectInput,
    );
  }

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
  getCreator(@Parent() task: Task) {
    const { created_by } = task;
    return this.usersService.findOne(created_by);
  }
}
