import { CreateTaskInput } from './create-task.input';
import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(
  OmitType(CreateTaskInput, ['projectId'] as const),
) {
  @Field(() => ID)
  id: string;
}
