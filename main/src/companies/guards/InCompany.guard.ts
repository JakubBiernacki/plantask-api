import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { CompaniesService } from '../companies.service';

@Injectable()
export class InCompanyGuard implements CanActivate {
  constructor(private readonly companiesService: CompaniesService) {}

  async canActivate(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    const { id } = ctx.getArgs();
    const company = await this.companiesService.findOne(id);

    return company.equals(user?.company);
  }
}
