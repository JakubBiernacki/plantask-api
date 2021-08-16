import {
  Args,
  Mutation,
  Parent,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { GetIdArgs } from '../common/dto/getId.args';
import { BaseResolver } from '../common/resolvers/base.resolver';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';

@Resolver(() => Task)
@UseGuards(GqlAuthGuard)
export class TasksResolver extends BaseResolver(Task) {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
    private usersService: UsersService,
  ) {
    super(tasksService, usersService);
  }

  @Mutation(() => Task)
  async createTask(
    @GetUser() user,
    @Args('createTaskInput') createTaskInput: CreateTaskInput,
  ) {
    const { projectId } = createTaskInput;
    createTaskInput.project = await this.projectsService.findOne(projectId);
    createTaskInput.created_by = user;
    return this.tasksService.create(createTaskInput);
  }

  @Mutation(() => Task)
  async updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args() { id }: GetIdArgs) {
    return this.tasksService.remove(id);
  }

  @ResolveField('project', () => Project, { nullable: true })
  getProject(@Parent() task: Task) {
    const { project } = task;
    return this.projectsService.findOne(project);
  }

  @ResolveField('creator', () => User)
  getCreator(@Parent() task: Task) {
    const { created_by } = task;
    return this.usersService.findOne(created_by);
  }
}
