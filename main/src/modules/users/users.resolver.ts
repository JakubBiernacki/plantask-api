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
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  Inject,
  NotFoundException,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/jwt-gqlAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { BaseResolver } from '../../common/base/base.resolver';
import { Organization } from '../organizations/entities/organization.entity';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { GetIdArgs } from '../../common/dto/getId.args';
import { InvitationToOrganization } from '../invitations/entities/invitation-to-organization.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { userIsUserMiddleware } from '../../common/middlewares/user-is-user.middleware';
import { SetParentUserInterceptor } from './interceptors/set-parent-user.interceptor';
import { AccountType } from './enums/accountType.enum';
import { ACCOUNT_Types } from '../../common/decorators/account-type.decorator';
import { AccountTypeGuard } from '../../common/guards/account-type.guard';
import { PubSubEngine } from 'apollo-server-express';
import { ErrorsMessages, Providers, PubSubPublish } from '../../constants';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(
    @Inject(Providers.PUB_SUB)
    private pubSub: PubSubEngine,

    private usersService: UsersService,
    private projectsService: ProjectsService,
    private invitationsService: InvitationsService,
  ) {
    super(usersService);
  }

  @UseGuards(GqlAuthGuard)
  @UseInterceptors(SetParentUserInterceptor)
  @Query(() => User)
  me(@CurrentUser() user: User) {
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
    @CurrentUser() user,
    @Args() { id }: GetIdArgs,
  ) {
    const invitation = await this.invitationsService.findOne(id);

    if (!user.equals(invitation.user)) {
      throw new NotFoundException(ErrorsMessages.NO_INVITATION);
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
  leaveOrganization(@CurrentUser() user) {
    user.organization = null;
    user.accountType = AccountType.Normal;
    return user.save();
  }

  @ResolveField('organization', () => Organization, { nullable: true })
  getOrganization(@Parent() user: User) {
    return this.usersService.getOrganizationByUser(user);
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
    filter: (payload, variables, context) =>
      context.req.user.equals(payload.user),
    resolve: (value) => value,
  })
  async InvitationHandler() {
    return this.pubSub.asyncIterator(PubSubPublish.INVITATION);
  }
}
