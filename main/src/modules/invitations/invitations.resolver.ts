import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { InvitationsService } from './invitations.service';
import { InvitationToOrganization } from './entities/invitation-to-organization.entity';
import { User } from '../users/entities/user.entity';
import { Organization } from '../organizations/entities/organization.entity';

@Resolver(() => InvitationToOrganization)
export class InvitationsResolver {
  constructor(private invitationsService: InvitationsService) {}

  @ResolveField('user', () => User)
  async getUser(@Parent() { id }: InvitationToOrganization) {
    return this.invitationsService.getUser(id);
  }

  @ResolveField('organization', () => Organization)
  async getOrganization(@Parent() { id }: InvitationToOrganization) {
    return this.invitationsService.getOrganization(id);
  }
}
