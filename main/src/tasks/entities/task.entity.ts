import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';
import { Document } from 'mongoose';
import { BaseEntity } from '../../common/entities/base.entitie';
import { Project } from '../../projects/entities/project.entity';
import * as mongoose from 'mongoose';

@Schema()
@ObjectType()
export class Task extends BaseEntity {
  @Prop({ enum: TaskType })
  @Field(() => TaskType)
  type: TaskType;

  @Prop({ enum: TaskLevel })
  @Field(() => TaskLevel)
  level: TaskLevel;

  @Prop()
  @Field()
  description: string;

  @Prop({ type: Date, default: Date.now })
  @Field()
  created_at: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  @Field(() => Project, { nullable: true })
  project?: Project;
}
export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
