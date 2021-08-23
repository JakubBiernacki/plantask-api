import { Field, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { BaseEntity } from '../../../common/base/entities/base.entitie';

@Schema()
@ObjectType()
export class Organization extends BaseEntity {
  @Prop({ unique: true })
  @Field()
  name: string;
}

export type OrganizationDocument = Organization & Document;
export const OrganizationSchema = SchemaFactory.createForClass(Organization);
