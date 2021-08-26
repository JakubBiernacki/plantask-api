import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { BaseEntity } from '../../../common/base/entities/base.entitie';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@Schema({ collection: 'invitation_to_organization' })
@ObjectType()
export class InvitationToOrganization extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  user: User;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Organization' })
  @Field(() => Organization)
  organization: Organization;
}

export type InvitationToOrganizationDocument = InvitationToOrganization &
  Document;
export const InvitationToOrganizationSchema = SchemaFactory.createForClass(
  InvitationToOrganization,
);
