import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseService } from '../services/base.service';

@Injectable()
export abstract class InOrganizationGuard implements CanActivate {
  protected constructor(private readonly service: BaseService<any>) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const { id } = ctx.getArgs();
    const object = await this.service.findOne(id);

    if (!object?.company) {
      return user.equals(object.created_by);
    }

    return user.company.equals(object.company);
  }
}
