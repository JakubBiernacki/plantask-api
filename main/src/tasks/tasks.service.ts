import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { Model } from 'mongoose';
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  async create(project: Project, createTaskInput: CreateTaskInput) {
    return this.taskModel.create({ project, ...createTaskInput });
  }

  findAll() {
    return this.taskModel.find();
  }

  findOne(id) {
    return this.taskModel.findById(id);
  }

  update(id, updateTaskInput: UpdateTaskInput) {
    return this.taskModel.findByIdAndUpdate(id, updateTaskInput, { new: true });
  }

  remove(id) {
    return this.taskModel.findByIdAndRemove(id);
  }

  async getProjectByTaskId(id) {
    return (await this.findOne(id).populate('project')).project;
  }
  findByProject(project: Project) {
    return this.taskModel.find({ project });
  }
}
