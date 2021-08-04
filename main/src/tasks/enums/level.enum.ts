import { registerEnumType } from '@nestjs/graphql';

export enum TaskLevel {
  LOW = 'low',
  NORMAL = 'normal',
  IMPORTANT = 'important',
  VARY_IMPORTANT = 'very important',
}

registerEnumType(TaskLevel, {
  name: 'TaskLevel',
});
