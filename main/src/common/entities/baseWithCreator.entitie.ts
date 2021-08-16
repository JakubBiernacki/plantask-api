import { Prop, Schema } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { BaseEntity } from './base.entitie';
import { User } from '../../users/entities/user.entity';

@Schema()
@ObjectType()
export class BaseWithCreatorEntity extends BaseEntity {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  @Field(() => User)
  created_by: User;
}
