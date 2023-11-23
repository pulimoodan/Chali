import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotificationsService } from 'src/notifications/notifications.service';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      return this.prisma.user.create({
        data: { ...createUserDto },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          userName: true,
          email: true,
        },
      });
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  followers(userId: string) {
    return this.prisma.user.findMany({
      where: {
        following: {
          every: {
            creatorId: userId,
          },
        },
      },
    });
  }

  async stats(userId: string) {
    const rawStats = await this.prisma.$queryRaw`
      SELECT 
      (SELECT COUNT(*) FROM "Follow" WHERE "Follow"."creatorId" = "User"."id") AS followers,
      (SELECT COUNT(*) FROM "Post" WHERE "Post"."userId" = "User"."id") AS posts,
      (SELECT
        SUM("Reaction"."value")
        FROM "Reaction"
        LEFT JOIN "Post" ON "Post"."userId" = "User"."id"
        WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT
        COUNT(*)
        FROM "Bookmark"
        LEFT JOIN "Post" ON "Post"."userId" = "User"."id"
        WHERE "Bookmark"."postId" = "Post"."id"
      ) AS bookmarks
      FROM "User"
      WHERE "User"."id" = ${userId}
    `;
    return this.serializeResult(rawStats)[0];
  }

  async userName(userName: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userName,
      },
    });
    if (user) return { success: false };
    return { success: true };
  }

  following(userId: string) {
    return this.prisma.user.findMany({
      where: {
        followers: {
          every: {
            userId,
          },
        },
      },
    });
  }

  follow(userId: string, creatorId: string) {
    this.notificationService.notifyFollow({
      userId,
      creatorId,
    });
    return this.prisma.follow.create({
      data: {
        user: {
          connect: { id: userId },
        },
        creator: {
          connect: { id: creatorId },
        },
      },
    });
  }

  async unfollow(userId: string, creatorId: string) {
    await this.prisma.follow.delete({
      where: {
        userId_creatorId: {
          userId,
          creatorId,
        },
      },
    });

    return { success: true };
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        profilePic: true,
        email: true,
        createdAt: true,
        _count: {
          select: {
            notifications: {
              where: {
                read: false,
              },
            },
          },
        },
      },
    });
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        userName: true,
        email: true,
      },
    });
  }

  async remove(id: string) {
    await this.prisma.user.delete({
      where: { id },
    });
    return { success: true };
  }

  async uploadProfilePic(image: Express.Multer.File, userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { profilePic: true },
    });
    if (user.profilePic) {
      await this.cloudinaryService.deleteImage(user.profilePic);
    }
    const file = await this.cloudinaryService.uploadImage(image);
    await this.prisma.user.update({
      where: { id: userId },
      data: { profilePic: file.secure_url },
    });
    return file.secure_url;
  }

  serializeResult(rawPosts: any) {
    return rawPosts.map((item: any) => ({
      ...item,
      popularity: Number(item.popularity || 0),
      posts: Number(item.posts || 0),
      bookmarks: Number(item.bookmarks || 0),
      followers: Number(item.followers || 0),
    }));
  }
}
