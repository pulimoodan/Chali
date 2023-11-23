import { IsNotEmpty, IsDefined } from 'class-validator';

export class ResendDto {
  @IsDefined()
  @IsNotEmpty()
  userId: string;
}
