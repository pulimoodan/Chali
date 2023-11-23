import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class UserGuard implements CanActivate {
  private JWT_SECRET: string;
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromCookies(request);
    if (!token) {
      request['user'] = { userId: '' };
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.JWT_SECRET,
      });
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      request['user'] = payload;
    } catch {
      request['user'] = { userId: '' };
    }
    return true;
  }

  extractTokenFromCookies(request: Request): string | undefined {
    const token = request.cookies['token'] || undefined;
    return token;
  }
}
