import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { SignInDto } from './dto/signin.dto';
import { SignUpDto } from './dto/signup.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import { VerifyDto } from './dto/verify.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class AuthService {
  private JWT_SECRET: string;
  private HOST: string;

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private jwtService: JwtService,
    private usersService: UsersService,
    private mailerService: MailerService,
  ) {
    this.JWT_SECRET = this.configService.get('JWT_SECRET');
    this.HOST = this.configService.get('HOST');
  }

  async signin({ email, password }: SignInDto) {
    // step 1 // check if the user exists
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    // step 2 // checking verification
    if (user.verificationId) throw new NotFoundException('Email not verified');

    // step 3 // hashing password
    const correctPassword = await bcrypt.compare(password, user.password);
    if (!correctPassword) throw new UnauthorizedException('Incorrect password');

    // step 4 // set token
    const token = await this.generateJwtToken(user.id);
    return token;
  }

  async signup({ email, firstName, lastName, password }: SignUpDto) {
    // step 1 // check if email is already registered
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (user) throw new UnauthorizedException('Email already registered');

    // step 2 // hashing password
    password = await bcrypt.hash(password, 10);

    // step 3 // generate username
    const userName = await this.generateUserName(firstName, lastName);

    // stpe 5 // create user
    const createdUser = await this.usersService.create({
      email,
      firstName,
      lastName,
      password,
      userName,
    });

    // step 6 // send otp to the user email
    await this.sendVerification(createdUser.id);

    return createdUser;
  }

  async sendVerification(userId: string) {
    // create verification
    const user = await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        verification: {
          create: {},
        },
      },
      select: {
        email: true,
        verification: {
          select: {
            id: true,
          },
        },
      },
    });

    // send verification link through mail
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Email verification for Chali',
      text: `Please use the following link to verify your new accout for Chali. Link: ${this.HOST}/verify/${user.verification.id}`,
    });
  }

  async verify({ verificationId }: VerifyDto) {
    const verification = await this.prisma.verification.findUnique({
      where: { id: verificationId },
      select: { id: true, user: true },
    });
    if (verification) {
      await this.prisma.verification.delete({
        where: { id: verificationId },
      });
      return { success: true };
    } else {
      throw new UnauthorizedException('Verfication failed');
    }
  }

  async generateJwtToken(userId: string) {
    const token = await this.jwtService.signAsync(
      { userId },
      { secret: this.JWT_SECRET },
    );
    return token;
  }

  async generateUserName(firstName: string, lastName: string) {
    let finding = true;
    let userName = `${firstName.toLowerCase()}${lastName.toLowerCase()}`;
    while (finding) {
      const user = await this.prisma.user.findUnique({ where: { userName } });
      if (!user) finding = false;
      else userName += Math.floor(Math.random() * 10);
    }
    return userName;
  }
}
