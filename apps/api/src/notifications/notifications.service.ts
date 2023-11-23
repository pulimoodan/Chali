import { Injectable } from '@nestjs/common';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { PrismaService } from 'src/prisma/prisma.service';

const reactionValues = [-2, -1, 1, 2, 3, 4];

@Injectable()
export class NotificationsService {
  constructor(private prisma: PrismaService) {}

  create({ content, type, link }: CreateNotificationDto, userId: string) {
    return this.prisma.notification.create({
      data: {
        type,
        content,
        link,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async findAll(userId: string) {
    const notifications = await this.prisma.notification.findMany({
      where: {
        userId,
      },
      select: {
        id: true,
        content: true,
        type: true,
        link: true,
        createdAt: true,
        updatedAt: true,
        read: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    await this.prisma.notification.updateMany({
      where: {
        userId,
      },
      data: {
        read: true,
      },
    });
    this.checkFarewell(notifications);

    return notifications;
  }

  async remove(ids: string[]) {
    await this.prisma.notification.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  checkFarewell(notifications: any) {
    const ids = [];
    for (const notification of notifications) {
      if (notification.read) {
        const age = this.getDayDifference(notification.createdAt, new Date());
        if (age > 1) {
          ids.push(notification.id);
        }
      }
    }
    this.remove(ids);
  }

  getDayDifference(date1: Date, date2: Date) {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }

  async notifyComment({ userId, postId, comment }: CommentNotification) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    const content = `<a href="/profile/${user.id}">${user.firstName} ${user.lastName}</a> commented on your post: '${comment}'`;
    const link = `/post/${postId}`;
    return this.create({ type: 'comment', content, link }, post.userId);
  }

  async notifyBookmark({ userId, postId }: BookmarkNotification) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    const content = `<a href="/profile/${user.id}">${user.firstName} ${user.lastName}</a> bookmarked your post`;
    const link = `/post/${postId}`;
    return this.create({ type: 'bookmark', content, link }, post.userId);
  }

  async notifyReaction({ userId, postId, reaction }: ReactionNotification) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      select: { userId: true },
    });
    const content = `<a href="/profile/${user.id}">${user.firstName} ${
      user.lastName
    }</a> reacted to your post with <img src="*${reactionValues.indexOf(
      reaction,
    )}*"/>`;
    const link = `/post/${postId}`;
    return this.create({ type: 'reaction', content, link }, post.userId);
  }

  async notifyFollow({ userId, creatorId }: FollowNotification) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    const content = `<a href="/profile/${user.id}">${user.firstName} ${user.lastName}</a> started following you.`;
    const link = `/profile/${user.id}`;
    return this.create({ type: 'follow', content, link }, creatorId);
  }
}

interface BookmarkNotification {
  userId: string;
  postId: string;
}

interface FollowNotification {
  userId: string;
  creatorId: string;
}

interface ReactionNotification {
  userId: string;
  postId: string;
  reaction: number;
}

interface CommentNotification {
  userId: string;
  postId: string;
  comment: string;
}
