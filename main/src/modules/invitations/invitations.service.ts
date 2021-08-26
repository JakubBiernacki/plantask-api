import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  InvitationToOrganization,
  InvitationToOrganizationDocument,
} from './entities/invitation-to-organization.entity';
import { Model } from 'mongoose';
import { User } from '../users/entities/user.entity';
import { BaseService } from '../../common/base/base.service';

@Injectable()
export class InvitationsService extends BaseService<InvitationToOrganization> {
  constructor(
    @InjectModel(InvitationToOrganization.name)
    private invitationModel: Model<InvitationToOrganizationDocument>,
  ) {
    super(invitationModel);
  }

  getInvitationsForUser(user: User) {
    return this.invitationModel.find({ user });
  }

  createMany(invitations) {
    return this.invitationModel.insertMany(invitations);
  }

  async getUser(id) {
    return (await this.invitationModel.findById(id).populate('user')).user;
  }

  async getOrganization(id) {
    return (await this.invitationModel.findById(id).populate('organization'))
      .organization;
  }
}
