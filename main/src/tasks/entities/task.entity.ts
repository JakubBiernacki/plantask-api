import { ObjectType } from '@nestjs/graphql';
import { Prop, Schema } from '@nestjs/mongoose';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';

@Schema()
@ObjectType()
export class Task {
  @Prop()
  type: TaskType;

  @Prop()
  level: TaskLevel;

  @Prop()
  info: string;
}
