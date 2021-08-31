import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { Model } from 'mongoose';
import { Project } from '../projects/entities/project.entity';
import { BaseService } from '../../common/base/base.service';

@Injectable()
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.name)
    private taskModel: Model<TaskDocument>,
  ) {
    super(taskModel);
  }

  async create(createTaskInput: CreateTaskInput) {
    return this.taskModel.create(createTaskInput);
  }

  findTasksByProject(project: Project) {
    return this.taskModel.find({ project });
  }

  async getCreatorByTask(task: Task) {
    return (await this.taskModel.findOne(task).populate('created_by'))
      .created_by;
  }

  async getProjectByTask(task: Task) {
    return (await this.taskModel.findOne(task).populate('project')).project;
  }
}
