import { Prop, Schema } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  id: mongoose.Schema.Types.ObjectId;

  @Prop({ type: Date, default: Date.now })
  @Field()
  created_at: Date;
}

export type BaseEntityDocument = BaseEntity & Document;
