import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  Normal = 'Normal',
  Employee = 'Employee',
  Organizer = 'Organizer',
}

registerEnumType(AccountType, {
  name: 'AccountType',
});
