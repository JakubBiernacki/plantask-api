import { ExecutionContext, Injectable } from '@nestjs/common';
import { CompaniesService } from '../companies.service';
import { InCompanyGuard } from '../../common/guards/inCompany.guard';

@Injectable()
export class CompanyInCompanyGuard extends InCompanyGuard {
  constructor(private companiesService: CompaniesService) {
    super(companiesService);
  }

  async canActivate(context: ExecutionContext) {
    const { user, object } = await super.getData(context);

    return object.equals(user?.company);
  }
}
