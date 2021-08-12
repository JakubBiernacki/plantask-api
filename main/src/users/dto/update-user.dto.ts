import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { OmitType } from '@nestjs/graphql';

export class UpdateUserDto extends PartialType(
  OmitType(CreateUserDto, ['username'] as const),
) {}
