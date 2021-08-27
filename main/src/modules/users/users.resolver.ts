import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { GetUser } from '../auth/decorators/getUser.decorator';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/jwt-gqlAuth.guard';
import { CreateUserInput } from './dto/create-user.input';
import { BaseResolver } from '../../common/base/base.resolver';
import { Organization } from '../organizations/entities/organization.entity';
import { OrganizationsService } from '../organizations/organizations.service';
import { Project } from '../projects/entities/project.entity';
import { ProjectsService } from '../projects/projects.service';
import { GetIdArgs } from '../../common/dto/getId.args';
import { InvitationToOrganization } from '../invitations/entities/invitation-to-organization.entity';
import { InvitationsService } from '../invitations/invitations.service';
import { userIsUserMiddleware } from '../auth/middlewares/user-is-user.middleware';

@Resolver(() => User)
export class UsersResolver extends BaseResolver(User) {
  constructor(
    private usersService: UsersService,
    private organizationsService: OrganizationsService,
    private projectsService: ProjectsService,
    private invitationsService: InvitationsService,
  ) {
    super(usersService);
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User)
  me(@GetUser() user: User) {
    return user;
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => User, { name: `findOneUser` })
  async findOne(@Args() args: GetIdArgs) {
    return super.findOne(args);
  }

  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
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
}
