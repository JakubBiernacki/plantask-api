import { SetMetadata } from '@nestjs/common';
import { AccountType } from '../../modules/users/enums/accountType.enum';

export const ACCOUNT_Type_KEY = 'accountType';
export const ACCOUNT_Types = (...accountTypes: AccountType[]) =>
  SetMetadata(ACCOUNT_Type_KEY, accountTypes);
