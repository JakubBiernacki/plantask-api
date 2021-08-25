import { CreateProjectInput } from './create-project.input';
import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateProjectInput extends PartialType(CreateProjectInput) {
  @Field(() => ID)
  id: string;
}
