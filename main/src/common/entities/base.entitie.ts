import { Schema } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import * as mongoose from 'mongoose';

@Schema()
@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  id: mongoose.Schema.Types.ObjectId;
}
