import { InOrganizationGuard } from '../../common/guards/inOrganization.guard';
import { ProjectsService } from '../projects.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectInOrganizationGuard extends InOrganizationGuard {
  constructor(private readonly projectsService: ProjectsService) {
    super(projectsService);
  }
}
