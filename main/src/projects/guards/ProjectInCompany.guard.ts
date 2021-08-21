import { InCompanyGuard } from '../../common/guards/inCompany.guard';
import { ProjectsService } from '../projects.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ProjectInCompanyGuard extends InCompanyGuard {
  constructor(private projectsService: ProjectsService) {
    super(projectsService);
  }
}
