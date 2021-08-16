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

@Resolver(() => Task)
export class TasksResolver extends BaseResolver(Task) {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
  ) {
    super(tasksService);
  }

  @Mutation(() => Task)
  async createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    const { projectId } = createTaskInput;
    createTaskInput.project = await this.projectsService.findOne(projectId);
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
    const { id } = task;
    return this.tasksService.getProjectByTaskId(id);
  }
}
