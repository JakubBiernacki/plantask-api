import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const userIsUserMiddleware: FieldMiddleware | any = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  const { user, parent } = ctx.context.req;

  const value = await next();
  if (user.equals(parent)) return value;
  throw new ForbiddenException(
    `User does not have sufficient permissions to access "${info.fieldName}" field.`,
  );
};
