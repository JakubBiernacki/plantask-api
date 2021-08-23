import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { TaskType } from '../enums/type.enum';
import { TaskLevel } from '../enums/level.enum';
import * as mongoose from 'mongoose';
import { Document } from 'mongoose';
import { Project } from '../../projects/entities/project.entity';
import { BaseWithCreatorEntity } from '../../../common/base/entities/baseWithCreator.entitie';

@Schema()
@ObjectType()
export class Task extends BaseWithCreatorEntity {
  @Prop({ enum: TaskType })
  @Field(() => TaskType)
  type: TaskType;

  @Prop({ enum: TaskLevel })
  @Field(() => TaskLevel)
  level: TaskLevel;

  @Prop()
  @Field()
  description: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  @Field(() => Project, { nullable: true })
  project?: Project;
}
export type TaskDocument = Task & Document;
export const TaskSchema = SchemaFactory.createForClass(Task);
