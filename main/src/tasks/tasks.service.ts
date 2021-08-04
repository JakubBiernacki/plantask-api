import { Injectable } from '@nestjs/common';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './entities/task.entity';
import { Model } from 'mongoose';

@Injectable()
export class TasksService {
  constructor(
    @InjectModel(Task.name) private readonly taskModel: Model<TaskDocument>,
  ) {}

  create(createTaskInput: CreateTaskInput) {
    return this.taskModel.create(createTaskInput);
  }

  findAll() {
    return this.taskModel.find();
  }

  findOne(id) {
    return this.taskModel.findOne({ _id: id });
  }

  update(id, updateTaskInput: UpdateTaskInput) {
    return this.taskModel.findByIdAndUpdate(id, updateTaskInput, { new: true });
  }

  remove(id) {
    return this.taskModel.findByIdAndRemove(id);
  }
}
