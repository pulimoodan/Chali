import { Controller, Post, Body, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { VerifyDto } from './dto/verify.dto';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('auth')
export class AuthController {
  private DOMAIN: string;

  constructor(
    private readonly authService: AuthService,
    private configService: ConfigService,
  ) {
    this.DOMAIN = this.configService.get('HOST').split('/')[2];
  }

  @Post('signin')
  async signin(
    @Body() signInDto: SignInDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signin(signInDto);
    res.cookie('token', token, {
      domain: this.DOMAIN,
      httpOnly: true,
    });
    return { token };
  }

  @Post('signout')
  async signout(@Res({ passthrough: true }) res: Response) {
    res.cookie('token', null);
    return { success: true };
  }

  @Post('signup')
  signup(@Body() signUpDto: SignUpDto) {
    return this.authService.signup(signUpDto);
  }

  @Post('verify')
  verify(
    @Body() verifyDto: VerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.authService.verify(verifyDto);
  }
}
