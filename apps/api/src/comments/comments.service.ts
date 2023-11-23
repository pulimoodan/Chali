import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class CommentsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  create({ postId, userId, content }: CreateCommentDto) {
    this.notificationService.notifyComment({
      userId,
      postId,
      comment: content,
    });
    return this.prisma.comment.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
        post: {
          connect: {
            id: postId,
          },
        },
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            profilePic: true,
          },
        },
      },
    });
  }

  listPost(postId: string) {
    return this.prisma.comment.findMany({
      where: {
        postId,
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            userName: true,
            profilePic: true,
          },
        },
      },
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
    });
  }

  listProfile(userId: string) {
    return this.prisma.comment.findMany({
      where: {
        userId,
      },
    });
  }

  findOne(id: string) {
    return this.prisma.comment.findUnique({
      where: {
        id,
      },
    });
  }

  update(id: string, { content }: UpdateCommentDto) {
    return this.prisma.comment.update({
      where: {
        id,
      },
      data: { content },
    });
  }

  async remove(id: string) {
    await this.prisma.comment.delete({
      where: { id },
    });
    return { success: true };
  }
}
