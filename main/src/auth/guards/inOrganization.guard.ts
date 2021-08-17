import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ProjectsService } from '../../projects/projects.service';

@Injectable()
export class InOrganizationGuard implements CanActivate {
  constructor(private readonly projectsService: ProjectsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const { id } = ctx.getArgs();
    const project = await this.projectsService.findOne(id);

    if (!project?.company) {
      return user.equals(project.created_by);
    }

    return user.company.equals(project.company);
  }
}
