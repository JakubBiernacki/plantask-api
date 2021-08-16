import { Field, ID, InputType } from '@nestjs/graphql';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';
import { ObjectId } from 'mongoose';
import { MinLength } from 'class-validator';
import { Project } from '../../projects/entities/project.entity';
import { User } from '../../users/entities/user.entity';

@InputType()
export class CreateTaskInput {
  @Field(() => TaskType)
  type: TaskType;

  @Field(() => TaskLevel)
  level: TaskLevel;

  @Field()
  @MinLength(3)
  description: string;

  @Field(() => ID, { nullable: true })
  projectId?: ObjectId;

  created_by: User;

  project?: Project;
}
