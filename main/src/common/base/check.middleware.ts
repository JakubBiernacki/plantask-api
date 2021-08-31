import { ForbiddenException } from '@nestjs/common';
import { FieldMiddleware, MiddlewareContext, NextFn } from '@nestjs/graphql';
import { ErrorsMessages } from '../../constants';

export const checkMiddleware: FieldMiddleware | any = async (
  ctx: MiddlewareContext,
  next: NextFn,
  field: string,
) => {
  const { info } = ctx;
  const { extensions } = info.parentType.getFields()[info.fieldName];

  const requiredMetadata = ctx.context.req.user[field];
  if (requiredMetadata !== extensions[field]) {
    throw new ForbiddenException(
      `${info.fieldName}: ${ErrorsMessages.NOT_PERMISSION}`,
    );
  }
  return next();
};
