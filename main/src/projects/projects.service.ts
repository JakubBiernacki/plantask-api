import { Injectable } from '@nestjs/common';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { TasksService } from '../tasks/tasks.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name)
    private readonly projectModel: Model<ProjectDocument>,
    private readonly tasksService: TasksService,
  ) {}

  create(createProjectInput: CreateProjectInput) {
    return this.projectModel.create(createProjectInput);
  }

  findAll() {
    return this.projectModel.find();
  }

  findOne(id) {
    return this.projectModel.findById(id);
  }

  update(id, updateProjectInput: UpdateProjectInput) {
    return this.projectModel.findByIdAndUpdate(id, updateProjectInput, {
      new: true,
    });
  }

  async remove(id) {
    const project = await this.findOne(id);
    this.tasksService.findByProject(project).deleteMany();
    return project.remove();
  }

  getTasksByProjectId(project: Project) {
    return this.tasksService.findByProject(project);
  }
}
