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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { BadRequestException, Inject, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/jwt-gqlAuth.guard';
import { AccountType } from '../users/enums/accountType.enum';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { ACCOUNT_Types } from '../../common/decorators/account-type.decorator';
import { AccountTypeGuard } from '../../common/guards/account-type.guard';
import { OrganizationInOrganizationGuard } from '../../common/guards/in-organization/organization-in-organization.guard';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { InvitationToOrganization } from '../invitations/entities/invitation-to-organization.entity';
import { PubSubEngine } from 'apollo-server-express';
import { Providers } from '../../constants';

@Resolver(() => Organization)
@UseGuards(GqlAuthGuard)
export class OrganizationsResolver extends BaseResolver(Organization) {
  constructor(
    @Inject(Providers.PUB_SUB)
    private readonly pubSub: PubSubEngine,

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
    @CurrentUser() user,
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

  @UseGuards(OrganizationInOrganizationGuard)
  @Query(() => Organization, { name: `findOne${Organization.name}` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(OrganizationInOrganizationGuard, AccountTypeGuard)
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
  @UseGuards(AccountTypeGuard)
  @Mutation(() => [InvitationToOrganization])
  async addUsersToOrganization(
    @CurrentUser() user: User,
    @Args({ name: 'users', type: () => [String] })
    usersIds: string[],
  ) {
    const users = await this.usersService.findByIds(usersIds);
    const invitations = await this.organizationsService.sendInvitationToUsers(
      user.organization,
      users,
    );

    Promise.all(
      invitations.map((invitation) =>
        this.pubSub.publish(
          `invitationToOrganization-${invitation.user.id}`,
          invitation,
        ),
      ),
    );

    return invitations;
  }

  @ACCOUNT_Types(AccountType.Organizer)
  @UseGuards(OrganizationInOrganizationGuard, AccountTypeGuard)
  @Mutation(() => Organization)
  async removeOrganization(@Args() { id }: GetIdArgs) {
    await this.usersService
      .findByOrganization(id)
      .updateMany(
        { accountType: AccountType.Employee },
        { $set: { organization: null, accountType: AccountType.Normal } },
      );

    const projects = await this.projectsService.getProjectsByOrganization(id);
    await Promise.all(
      projects.map((project) => this.projectsService.remove(project.id)),
    );

    return this.organizationsService.remove(id);
  }

  @ResolveField('users', () => [User])
  async getUsers(@Parent() organization: Organization) {
    return this.usersService.findByOrganization(organization);
  }

  @ResolveField('projects', () => [Project], { nullable: true })
  getProjects(@Parent() organization: Organization) {
    return this.projectsService.getProjectsByOrganization(organization);
  }
}
