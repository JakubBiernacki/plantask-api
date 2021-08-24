import { User } from '../../users/entities/user.entity';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseEntity } from '../../../common/base/entities/base.entitie';
import { Document } from 'mongoose';
import * as mongoose from 'mongoose';

@Schema()
export class Token extends BaseEntity {
  @Prop()
  token: string;

  @Prop({ type: Date })
  expiresOn: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export type TokenDocument = Token & Document;
export const TokenSchema = SchemaFactory.createForClass(Token);
