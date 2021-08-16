import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { BaseResolver } from '../common/resolvers/base.resolver';
import { CreateCompanyInput } from './dto/create-company.input';
import { UpdateCompanyInput } from './dto/update-company.input';
import { GetIdArgs } from '../common/dto/getId.args';

@Resolver(() => Company)
export class CompaniesResolver extends BaseResolver(Company) {
  constructor(private readonly companiesService: CompaniesService) {
    super(companiesService);
  }

  @Mutation(() => Company)
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
  ) {
    return this.companiesService.create(createCompanyInput);
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
