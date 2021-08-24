import { ExecutionContext, Injectable } from '@nestjs/common';
import { OrganizationsService } from '../organizations.service';
import { InOrganizationGuard } from '../../../common/base/in-organization.guard';

@Injectable()
export class UserInOrganizationGuard extends InOrganizationGuard {
  constructor(private organizationsService: OrganizationsService) {
    super(organizationsService);
  }

  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    return object.equals(user?.organization);
  }
}
