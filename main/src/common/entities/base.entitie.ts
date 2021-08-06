import { Schema } from '@nestjs/mongoose';
import { ObjectId } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@Schema()
@ObjectType()
export abstract class BaseEntity {
  @Field(() => ID)
  id: ObjectId;
}
