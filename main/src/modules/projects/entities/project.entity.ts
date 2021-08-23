import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseCreatorEntity } from '../../../common/base/entities/base-creator.entitie';
import { Organization } from '../../organizations/entities/organization.entity';
import * as mongoose from 'mongoose';
import { User } from '../../users/entities/user.entity';

@Schema()
@ObjectType()
export class Project extends BaseCreatorEntity {
  @Prop()
  @Field()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'organization',
  })
  @Field(() => Organization, { nullable: true })
  organization?: Organization;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] })
  @Field(() => [User])
  users: User[];
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
