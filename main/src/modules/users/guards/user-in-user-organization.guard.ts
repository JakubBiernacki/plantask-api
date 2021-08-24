import { ExecutionContext, Injectable } from '@nestjs/common';
import { InOrganizationGuard } from '../../../common/base/in-organization.guard';
import { UsersService } from '../users.service';

@Injectable()
export class UserInUserOrganizationGuard extends InOrganizationGuard {
  constructor(private usersService: UsersService) {
    super(usersService);
  }
  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    if (!user?.organization) {
      return user.equals(object);
    }

    return user.organization.equals(object.organization);
  }
}
