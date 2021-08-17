import { Field, InputType } from '@nestjs/graphql';
import { User } from '../../users/entities/user.entity';
import { Company } from '../../companies/entities/company.entity';

@InputType()
export class CreateProjectInput {
  @Field()
  name: string;

  created_by: User;

  company?: Company;
}
