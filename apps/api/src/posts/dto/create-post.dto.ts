import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsDefined()
  @IsNotEmpty()
  content: string;
}
