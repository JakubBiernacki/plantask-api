import { registerEnumType } from '@nestjs/graphql';

export enum AccountType {
  Normal = 'Normal',
  Employee = 'employee',
  Organizer = 'organizer',
}

registerEnumType(AccountType, {
  name: 'AccountType',
});
