import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AccountType } from '../../users/enums/accountType.enum';
import { ACCOUNT_Type_KEY } from '../decorators/accountType.decorator';

@Injectable()
export class AccountTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredAccountType = this.reflector.getAllAndOverride<AccountType[]>(
      ACCOUNT_Type_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (!requiredAccountType) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);
    const { user } = ctx.getContext().req;
    return requiredAccountType.some(
      (accountType) => user.accountType === accountType,
    );
  }
}
