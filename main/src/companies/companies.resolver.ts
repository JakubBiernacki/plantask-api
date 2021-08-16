import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { BaseResolver } from '../common/resolvers/base.resolver';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { GetIdArgs } from '../common/dto/getId.args';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { AccountType } from '../users/enums/accountType.enum';

@Resolver(() => Company)
@UseGuards(GqlAuthGuard)
export class CompaniesResolver extends BaseResolver(Company) {
  constructor(private readonly companiesService: CompaniesService) {
    super(companiesService);
  }

  @Mutation(() => Company)
  async createCompany(
    @GetUser() user,
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    const company = await this.companiesService.create(createCompanyInput);
    user.company = company;
    user.accountType = AccountType.Organizer;
    user.save();
    return company;
  }

  @Mutation(() => Company)
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companiesService.update(
      updateCompanyInput.id,
      updateCompanyInput,
    );
  }

  @Mutation(() => Company)
  removeCompany(@Args() { id }: GetIdArgs) {
    return this.companiesService.remove(id);
  }
}
