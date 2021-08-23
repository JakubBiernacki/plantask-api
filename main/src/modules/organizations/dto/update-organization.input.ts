import { CreateOrganizationInput } from './create-organization.input';
import { Field, InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateOrganizationInput extends PartialType(
  CreateOrganizationInput,
) {
  @Field()
  id: string;
}
