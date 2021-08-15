import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { checkMiddleware } from '../../common/middlewares/check.middleware';

export const checkRoleMiddleware: FieldMiddleware = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => checkMiddleware(ctx, next, 'role');
