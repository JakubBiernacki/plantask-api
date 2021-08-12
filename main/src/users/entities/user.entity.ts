import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { BaseEntity } from '../../common/entities/base.entitie';

@Schema()
@ObjectType()
export class User extends BaseEntity {
  @Prop({ unique: true })
  @Field()
  username: string;

  @Prop({ unique: true })
  @Field()
  email: string;

  @Prop({ select: false })
  password: string;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  // @Field(() => Project, { nullable: true })
  // company?: ;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
