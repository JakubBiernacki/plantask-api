import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
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
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ACCOUNT_Types } from '../auth/decorators/accountType.decorator';
import { AccountTypeGuard } from '../auth/guards/accountType.guard';
import { OrganizationInOrganizationGuard } from './guards/organizationInOrganization.guard';

@Resolver(() => Company)
@UseGuards(GqlAuthGuard)
export class CompaniesResolver extends BaseResolver(Company) {
  constructor(
    private companiesService: CompaniesService,
    private usersService: UsersService,
  ) {
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

  @UseGuards(OrganizationInOrganizationGuard)
  @Query(() => Company, { name: `findOne${Company.name}` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(OrganizationInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Company)
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
  ) {
    return this.companiesService.update(
      updateCompanyInput.id,
      updateCompanyInput,
    );
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(OrganizationInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Company)
  removeCompany(@Args() { id }: GetIdArgs) {
    return this.companiesService.remove(id);
  }

  @ResolveField('users', () => [User])
  getUsers(@Parent() company: Company) {
    this.usersService.findByCompany(company);
  }
}
