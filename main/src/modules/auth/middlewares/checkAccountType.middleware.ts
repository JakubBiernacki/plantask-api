import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { checkMiddleware } from '../../../common/middlewares/check.middleware';

const FIELD = 'accountType';

export const checkAccountTypeMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => checkMiddleware(ctx, next, FIELD);
