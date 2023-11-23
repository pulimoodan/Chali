import { Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [NotificationsController],
  imports: [PrismaModule, JwtModule, ConfigModule],
  exports: [NotificationsService],
  providers: [NotificationsService],
})
export class NotificationsModule {}
