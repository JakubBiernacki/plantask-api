import { Module } from '@nestjs/common';
import { InvitationsService } from './invitations.service';
import { InvitationsResolver } from './invitations.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import {
  InvitationToOrganization,
  InvitationToOrganizationSchema,
} from './entities/invitation-to-organization.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: InvitationToOrganization.name,
        schema: InvitationToOrganizationSchema,
      },
    ]),
  ],
  providers: [InvitationsResolver, InvitationsService],
  exports: [InvitationsService],
})
export class InvitationsModule {}
