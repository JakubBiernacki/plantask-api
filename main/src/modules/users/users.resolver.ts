import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetUser } from '../../common/decorators/getUser.decorator';
import {
  BadRequestException,
  Inject,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/jwt-gqlAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { BaseResolver } from '../../common/base/base.resolver';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { GetIdArgs } from '../../common/dto/getId.args';
import { InvitationToOrganization } from '../invitations/entities/invitation-to-organization.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { userIsUserMiddleware } from '../../common/middlewares/user-is-user.middleware';
import { SetParentUserInterceptor } from './interceptors/set-parent-user.interceptor';
import { AccountType } from './enums/accountType.enum';
import { ACCOUNT_Types } from '../../common/decorators/accountType.decorator';
import { AccountTypeGuard } from '../../common/guards/accountType.guard';
import { PubSubEngine } from 'apollo-server-express';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService,
    private invitationsService: InvitationsService,

    @Inject('PUB_SUB')
    private readonly pubSub: PubSubEngine,
  ) {
    super(usersService);
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(SetParentUserInterceptor)
  @Query(() => User)
  me(@GetUser() user: User) {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(SetParentUserInterceptor)
  @Query(() => User, { name: `findOneUser` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @ACCOUNT_Types(AccountType.Normal)
  @UseGuards(GqlAuthGuard, AccountTypeGuard)
  @Mutation(() => User)
  async acceptInvitationToOrganization(
    @GetUser() user,
    @Args() { id }: GetIdArgs,
  ) {
    const invitation = await this.invitationsService.findOne(id);

    if (!user.equals(invitation.user)) {
      throw new BadRequestException('You do not have this invitation');
    }

    user.organization = invitation.organization;
    user.accountType = AccountType.Employee;
    user.save();
    await this.invitationsService.remove(id);
    return user;
  }

  @ACCOUNT_Types(AccountType.Employee)
  @UseGuards(GqlAuthGuard, AccountTypeGuard)
  @Mutation(() => User)
  leaveOrganization(@GetUser() user) {
    user.organization = null;
    user.accountType = AccountType.Normal;
    return user.save();
  }

  @ResolveField('organization', () => Organization, { nullable: true })
  getOrganization(@Parent() user: User) {
    const { organization } = user;
    return this.organizationsService.findOne(organization);
  }

  @ResolveField('projects', () => [Project], { nullable: true })
  getProjects(@Parent() user: User) {
    return this.projectsService.getProjectsByUser(user);
  }

  @ResolveField('invitations', () => [InvitationToOrganization], {
    nullable: true,
    middleware: [userIsUserMiddleware],
  })
  getInvitations(@Parent() user: User) {
    return this.invitationsService.getInvitationsForUser(user);
  }

  @UseGuards(GqlAuthGuard)
  @Subscription(() => InvitationToOrganization, {
    filter: (payload, variables) => {
      console.log(payload, variables);
      // return variables.user.equals(payload.user);
      return true;
    },
    resolve: (value) => value,
  })
  async sendInvitationHandler(@GetUser() user) {
    return this.pubSub.asyncIterator(`invitationToOrganization-${user.id}`);
  }
}
