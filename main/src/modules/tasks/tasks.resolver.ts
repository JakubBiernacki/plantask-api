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
import { GetIdArgs } from '../../common/dto/getId.args';
import { BaseResolver } from '../../common/base/base.resolver';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/jwt-gqlAuth.guard';
import { GetUser } from '../../common/decorators/getUser.decorator';
import { User } from '../users/entities/user.entity';

@Resolver(() => Task)
@UseGuards(GqlAuthGuard)
export class TasksResolver extends BaseResolver(Task) {
  constructor(
    private tasksService: TasksService,
    private projectsService: ProjectsService,
  ) {
    super(tasksService);
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
    return this.tasksService.getProjectByTask(task);
  }

  @ResolveField('created_by', () => User)
  getCreator(@Parent() task: Task) {
    return this.tasksService.getCreatorByTask(task);
  }
}
