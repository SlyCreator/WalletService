import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { isNumber } from 'class-validator';

interface  IAuthUser {
  userId?: number
}
export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
