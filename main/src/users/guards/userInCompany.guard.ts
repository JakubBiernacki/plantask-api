import { ExecutionContext, Injectable } from '@nestjs/common';
import { InCompanyGuard } from '../../common/guards/inCompany.guard';
import { UsersService } from '../users.service';

@Injectable()
export class UserInCompanyGuard extends InCompanyGuard {
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
