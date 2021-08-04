import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { TasksService } from './tasks.service';
import { Task } from './entities/task.entity';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';

@Resolver(() => Task)
export class TasksResolver {
  constructor(private readonly tasksService: TasksService) {}

  @Mutation(() => Task)
  createTask(@Args('createTaskInput') createTaskInput: CreateTaskInput) {
    console.log(createTaskInput);
    return this.tasksService.create(createTaskInput);
  }

  @Query(() => [Task], { name: 'tasks' })
  findAll() {
    return this.tasksService.findAll();
  }

  @Query(() => Task, { name: 'task' })
  findOne(@Args('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Mutation(() => Task)
  updateTask(@Args('updateTaskInput') updateTaskInput: UpdateTaskInput) {
    return this.tasksService.update(updateTaskInput.id, updateTaskInput);
  }

  @Mutation(() => Task)
  removeTask(@Args('id') id: string) {
    return this.tasksService.remove(id);
  }
}
