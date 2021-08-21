import { ExecutionContext, Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { InOrganizationGuard } from '../../common/guards/inOrganization.guard';

@Injectable()
export class OrganizationInOrganizationGuard extends InOrganizationGuard {
  constructor(private companiesService: CompaniesService) {
    super(companiesService);
  }

  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    return object.equals(user?.company);
  }
}
