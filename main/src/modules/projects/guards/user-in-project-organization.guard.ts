import { InOrganizationGuard } from '../../../common/base/in-organization.guard';
import { ProjectsService } from '../projects.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserInProjectOrganizationGuard extends InOrganizationGuard {
  constructor(private projectsService: ProjectsService) {
    super(projectsService);
  }
}
