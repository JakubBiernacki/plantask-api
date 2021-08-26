import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Organization,
  OrganizationDocument,
} from './entities/organization.entity';
import { BaseService } from '../../common/base/base.service';
import { User } from '../users/entities/user.entity';
import { InvitationsService } from '../invitations/invitations.service';

@Injectable()
export class OrganizationsService extends BaseService<Organization> {
  constructor(
    @InjectModel(Organization.name)
    private organizationModel: Model<OrganizationDocument>,

    private invitationsService: InvitationsService,
  ) {
    super(organizationModel);
  }

  async sendInvitationToUsers(id, users: User[]) {
    const organization = await this.findOne(id);
    const invitations = [];

    users.forEach((user) => invitations.push({ user, organization }));

    return this.invitationsService.createMany(invitations);
  }
}
