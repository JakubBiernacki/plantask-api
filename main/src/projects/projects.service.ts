import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { TasksService } from '../tasks/tasks.service';
import { BaseService } from '../common/services/base.service';

@Injectable()
export class ProjectsService extends BaseService<Project> {
  constructor(
    @InjectModel(Project.name)
    private projectModel: Model<ProjectDocument>,
    private tasksService: TasksService,
  ) {
    super(projectModel);
  }

  async remove(id) {
    const project = await this.findOne(id);
    this.tasksService.findTasksByProject(project).deleteMany();
    return project.remove();
  }

  getTasksByProjectId(project: Project) {
    return this.tasksService.findTasksByProject(project);
  }

  async getUsersByProjectId(project: Project) {
    return (await this.projectModel.findOne(project).populate('users')).users;
  }

  getProjectsByUserId(user) {
    return this.projectModel.find({ users: { $in: user } });
  }
}
