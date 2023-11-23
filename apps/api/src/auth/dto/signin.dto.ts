import { IsEmail, IsNotEmpty, IsDefined } from 'class-validator';

export class SignInDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  password: string;
}
