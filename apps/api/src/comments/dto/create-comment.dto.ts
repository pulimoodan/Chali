import { IsDefined, IsNotEmpty } from 'class-validator';

export class CreateCommentDto {
  @IsDefined()
  @IsNotEmpty()
  userId: string;

  @IsDefined()
  @IsNotEmpty()
  postId: string;

  @IsDefined()
  @IsNotEmpty()
  content: string;
}
