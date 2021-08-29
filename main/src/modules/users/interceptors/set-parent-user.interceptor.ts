import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class SetParentUserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = GqlExecutionContext.create(context);
    const { req } = ctx.getContext();

    req.parent = ctx.getArgs().id;
    if (ctx.getInfo().fieldName === 'me') req.parent = req.user;
    return next.handle();
  }
}
