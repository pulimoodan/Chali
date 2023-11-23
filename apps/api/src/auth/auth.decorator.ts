import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from './entities/auth.entity';

export const GetAuth = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): Auth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
