import { IsEmail, IsNotEmpty, IsDefined } from 'class-validator';

export class SignUpDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsDefined()
  @IsNotEmpty()
  firstName: string;

  @IsDefined()
  @IsNotEmpty()
  lastName: string;

  @IsDefined()
  @IsNotEmpty()
  password: string; 
}
