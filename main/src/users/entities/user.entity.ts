import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Extensions, Field, ObjectType } from '@nestjs/graphql';
import { Document } from 'mongoose';
import { BaseEntity } from '../../common/entities/base.entitie';
import { Role } from '../enums/role.enum';
import { AccountType } from '../enums/accountType.enum';
import { checkRoleMiddleware } from '../../auth/middlewares/checkRole.middleware';

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

  @Prop({ enum: AccountType, default: AccountType.Normal })
  @Field(() => AccountType)
  accountType: AccountType;

  // @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Project' })
  // @Field(() => Project, { nullable: true })
  // company?: ;

  @Prop({ enum: Role, default: Role.User })
  @Field({ middleware: [checkRoleMiddleware] })
  @Extensions({ role: Role.Admin })
  role: Role;
}
export type UserDocument = User & Document;
export const UserSchema = SchemaFactory.createForClass(User);
