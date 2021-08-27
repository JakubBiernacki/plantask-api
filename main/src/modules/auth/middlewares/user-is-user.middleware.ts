import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';

export const userIsUserMiddleware: FieldMiddleware | any = async (
  ctx: MiddlewareContext,
  next: NextFn,
) => {
  const { info } = ctx;
  const { user } = ctx.context.req;
  const value = await next();
  if (user.equals(value?.[0]?.user)) return value;
  throw new ForbiddenException(
    `User does not have sufficient permissions to access "${info.fieldName}" field.`,
  );
};
