import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TaskDocument = Task & Document;

@Schema()
@ObjectType()
export class Task {
  @Field(() => ID)
  id: MongooseSchema.Types.ObjectId;

  @Prop({ enum: TaskType })
  @Field(() => TaskType)
  type: TaskType;

  @Prop({ enum: TaskLevel })
  @Field(() => TaskLevel)
  level: TaskLevel;

  @Prop()
  @Field()
  description: string;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
