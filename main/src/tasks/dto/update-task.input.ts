import { CreateTaskInput } from './create-task.input';
import { InputType, Field, PartialType, ID, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateTaskInput extends PartialType(
  OmitType(CreateTaskInput, ['projectId'] as const),
) {
  @Field(() => ID)
  id: string;
}
