import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { BaseWithCreatorEntity } from '../../common/entities/baseWithCreator.entitie';
import { Company } from '../../companies/entities/company.entity';

@Schema()
@ObjectType()
export class Project extends BaseWithCreatorEntity {
  @Prop()
  @Field()
  name: string;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
  })
  @Field(() => Company, { nullable: true })
  company?: Company;
}

export type ProjectDocument = Project & Document;
export const ProjectSchema = SchemaFactory.createForClass(Project);
