import { IsNotEmpty, IsDefined, IsNumber } from 'class-validator';

export class VerifyDto {
  @IsDefined()
  @IsNotEmpty()
  verificationId: string;
}
