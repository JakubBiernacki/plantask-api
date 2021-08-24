import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class LoginResult {
  @Field()
  access_token: string;

  @Field(() => Int)
  expiresIn: number;

  @Field()
  refresh_token: string;
}
