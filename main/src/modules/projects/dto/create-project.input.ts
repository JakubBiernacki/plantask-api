import { Field, ID, InputType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Organization } from '../../organizations/entities/organization.entity';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  @Field(() => [ID], {
    nullable: true,
  })
  users?: User[] = [];

  created_by: User;

  organization?: Organization;
}
