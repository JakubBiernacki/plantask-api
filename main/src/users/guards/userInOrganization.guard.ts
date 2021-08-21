import { ExecutionContext, Injectable } from '@nestjs/common';
import { InOrganizationGuard } from '../../common/guards/inOrganization.guard';
import { UsersService } from '../users.service';

@Injectable()
export class UserInOrganizationGuard extends InOrganizationGuard {
  constructor(private usersService: UsersService) {
    super(usersService);
  }
  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    if (!user?.company) {
      return user.equals(object);
    }

    return user.company.equals(object.company);
  }
}
