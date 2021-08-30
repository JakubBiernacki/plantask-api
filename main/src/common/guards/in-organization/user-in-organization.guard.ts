import { ExecutionContext, Injectable } from '@nestjs/common';
import { InOrganizationGuard } from '../../base/in-organization.guard';
import { UsersService } from '../../../modules/users/users.service';

@Injectable()
export class UserInOrganizationGuard extends InOrganizationGuard {
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
