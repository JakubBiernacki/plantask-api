import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { BaseService } from '../services/base.service';

@Injectable()
export abstract class InOrganizationGuard implements CanActivate {
  protected constructor(private service: BaseService<any>) {}

  async getData(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const id = ctx.getArgs().id || Object.values<any>(ctx.getArgs())[0].id;
    const object = await this.service.findOne(id);
    return { user, object };
  }

  async canActivate(context: ExecutionContext) {
    const { user, object } = await this.getData(context);

    if (!object?.company) {
      return user.equals(object.created_by);
    }

    return user.company.equals(object.company);
  }
}
