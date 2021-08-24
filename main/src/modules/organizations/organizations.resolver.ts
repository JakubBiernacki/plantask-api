import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { OrganizationsService } from './organizations.service';
import { Organization } from './entities/organization.entity';
import { BaseResolver } from '../../common/base/base.resolver';
import { CreateOrganizationInput } from './dto/create-organization.input';
import { UpdateOrganizationInput } from './dto/update-organization.input';
import { GetIdArgs } from '../../common/dto/getId.args';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { BadRequestException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { AccountType } from '../users/enums/accountType.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ACCOUNT_Types } from '../auth/decorators/accountType.decorator';
import { AccountTypeGuard } from '../auth/guards/accountType.guard';
import { UserInOrganizationGuard } from './guards/user-in-organization.guard';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';

@Resolver(() => Organization)
@UseGuards(GqlAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization) {
  constructor(
    private organizationsService: OrganizationsService,
    private usersService: UsersService,
    private projectsService: ProjectsService,
  ) {
    super(organizationsService);
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(AccountTypeGuard)
  @Mutation(() => Organization)
  async createOrganization(
    @GetUser() user,
    @Args('createOrganizationInput')
    createOrganizationInput: CreateOrganizationInput,
  ) {
    if (user.organization)
      throw new BadRequestException(
        `user ${user.username} already has organization`,
      );

    const organization = await this.organizationsService.create(
      createOrganizationInput,
    );
    user.organization = organization;
    user.save();
    return organization;
  }

  @UseGuards(UserInOrganizationGuard)
  @Query(() => Organization, { name: `findOne${Organization.name}` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(UserInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Organization)
  updateOrganization(
    @Args('updateOrganizationInput')
    updateOrganizationInput: UpdateOrganizationInput,
  ) {
    return this.organizationsService.update(
      updateOrganizationInput.id,
      updateOrganizationInput,
    );
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(UserInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Organization)
  async removeOrganization(@Args() { id }: GetIdArgs) {
    await this.usersService
      .findByOrganization(id)
      .updateMany(
        {},
        { $set: { organization: null, accountType: AccountType.Normal } },
      );

    const projects = await this.projectsService.getProjectsByOrganization(id);
    await Promise.all(
      projects.map((project) => this.projectsService.remove(project.id)),
    );

    return this.organizationsService.remove(id);
  }

  @ResolveField('members', () => [User])
  async getUsers(@Parent() organization: Organization) {
    return this.usersService.findByOrganization(organization);
  }

  @ResolveField('projects', () => [Project], { nullable: true })
  getProjects(@Parent() organization: Organization) {
    return this.projectsService.getProjectsByOrganization(organization);
  }
}
