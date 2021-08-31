import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { Project, ProjectDocument } from './entities/project.entity';
import { TasksService } from '../tasks/tasks.service';
import { BaseService } from '../../common/base/base.service';

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
    return this.projectModel.remove(id);
  }

  getTasksByProjectId(project: Project) {
    return this.tasksService.findTasksByProject(project);
  }

  async getUsersByProject(project: Project) {
    return (await this.projectModel.findOne(project).populate('users')).users;
  }
  async getOrganizationByProject(project: Project) {
    return (await this.projectModel.findOne(project).populate('organization'))
      .organization;
  }

  async getCreatorByProject(project: Project) {
    return (await this.projectModel.findOne(project).populate('created_by'))
      .created_by;
  }

  getProjectsByUser(user) {
    return this.projectModel.find({ users: { $in: user } });
  }

  getProjectsByOrganization(organization) {
    return this.projectModel.find({ organization });
  }

  addContributors(id, newContributors) {
    return this.projectModel.findByIdAndUpdate(
      id,
      {
        $addToSet: { users: newContributors },
      },
      { new: true },
    );
  }
}
