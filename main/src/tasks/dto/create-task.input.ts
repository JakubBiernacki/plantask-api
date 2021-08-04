import { InputType, Field } from '@nestjs/graphql';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';

@InputType()
export class CreateTaskInput {
  @Field(() => TaskType)
  type: TaskType;

  @Field(() => TaskLevel)
  level: TaskLevel;

  @Field()
  description: string;
}
