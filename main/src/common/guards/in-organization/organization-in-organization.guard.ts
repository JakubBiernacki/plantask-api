import { ExecutionContext, Injectable } from '@nestjs/common';
import { OrganizationsService } from '../../../modules/organizations/organizations.service';
import { InOrganizationGuard } from '../../base/in-organization.guard';

@Injectable()
export class OrganizationInOrganizationGuard extends InOrganizationGuard {
  constructor(private organizationsService: OrganizationsService) {
    super(organizationsService);
  }

  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    return object.equals(user?.organization);
  }
}
