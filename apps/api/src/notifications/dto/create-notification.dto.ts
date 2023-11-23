export class CreateNotificationDto {
  type: 'reaction' | 'bookmark' | 'comment' | 'follow';
  content: string;
  link: string;
}
