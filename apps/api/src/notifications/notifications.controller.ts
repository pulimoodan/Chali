import { Controller, Get, UseGuards } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { Auth } from 'src/auth/entities/auth.entity';
import { GetAuth } from 'src/auth/auth.decorator';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @UseGuards(AuthGuard)
  findAll(@GetAuth() { userId }: Auth) {
    return this.notificationsService.findAll(userId);
  }
}
