import { PartialType } from '@nestjs/mapped-types';
import { CreateUserInput } from './create-user.input';
import { OmitType } from '@nestjs/graphql';

export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['username'] as const),
) {}
