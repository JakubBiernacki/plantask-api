import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { Model } from 'mongoose';
import { Project } from '../projects/entities/project.entity';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
  }

  create(createTaskInput: CreateTaskInput) {
    return this.taskModel.create(createTaskInput);
  }

  findByProject(project: Project) {
    return this.taskModel.find({ project });
  }
}
