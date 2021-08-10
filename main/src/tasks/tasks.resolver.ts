import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  ID,
} from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { PaginationArgs } from '../common/dto/pagination.args';

@Resolver(() => Task)
export class TasksResolver {
  constructor(
    private readonly tasksService: TasksService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Mutation(() => Task)
  async createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    const { projectId } = createTaskInput;
    const project = await this.projectsService.findOne(projectId);
    return this.tasksService.create(project, createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll(@Args() pagination: PaginationArgs) {
    const { limit, offset } = pagination;
    return this.tasksService.findAll().limit(limit).skip(offset);
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id', { type: () => ID }) id: string) {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  async updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args('id', { type: () => ID }) id: string) {
    return this.tasksService.remove(id);
  }

  @ResolveField('project', () => Project, { nullable: true })
  getProject(@Parent() task: Task) {
    const { id } = task;
    return this.tasksService.getProjectByTaskId(id);
  }
}
