import { ObjectType, Field } from '@nestjs/graphql';
import { BaseEntity } from '../../common/entities/base.entitie';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
@ObjectType()
export class Project extends BaseEntity {
  @Prop()
  @Field()
  name: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Tasks' })
  // @Field(() => [Task])
  // tasks: Task[];
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
