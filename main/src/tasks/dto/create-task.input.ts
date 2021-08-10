import { InputType, Field, ID } from '@nestjs/graphql';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';
import { ObjectId } from 'mongoose';

@InputType()
export class CreateTaskInput {
  @Field(() => TaskType)
  type: TaskType;

  @Field(() => TaskLevel)
  level: TaskLevel;

  @Field()
  description: string;

  @Field(() => ID, { nullable: true })
  projectId?: ObjectId;
}
