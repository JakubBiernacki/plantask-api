import { registerEnumType } from '@nestjs/graphql';

export enum TaskType {
  ISSUE = 'issue',
  TASK = 'task',
  GOALS = 'goals',
}
registerEnumType(TaskType, {
  name: 'TaskType',
});
