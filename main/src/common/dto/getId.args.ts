import { ArgsType, Field, ID } from '@nestjs/graphql';
import { ObjectId } from 'mongoose';

@ArgsType()
export class GetIdArgs {
  @Field(() => ID)
  id: ObjectId;
}
