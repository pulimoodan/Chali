import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { listType } from './entities/listType.entity';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationsService,
  ) {}

  create({ content }: CreatePostDto, userId: string) {
    return this.prisma.post.create({
      data: {
        content,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async list(currentUserId: string, page: number, type: listType) {
    switch (type) {
      case 'recent':
        return this.listRecent(currentUserId, page);
      case 'following':
        if (!currentUserId) return [];
        return this.listFollowing(currentUserId, page);
      case 'bookmarked':
        if (!currentUserId) return [];
        return this.listBookmarked(currentUserId, page);
      case 'trending':
        return this.listTrending(currentUserId, page);
      default:
        return [];
    }
  }

  async listRecent(currentUserId: string, page: number) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
      (SELECT
        COALESCE(SUM("Reaction"."value"), 0)
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      GROUP BY "Post"."id", "User"."id"
      ORDER BY "Post"."createdAt" DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async search(currentUserId: string, page: number, query: string) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
      (SELECT
        COALESCE(SUM("Reaction"."value"), 0)
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      WHERE "Post"."content" like CONCAT('%', ${query}, '%')
      GROUP BY "Post"."id", "User"."id"
      ORDER BY "Post"."createdAt" DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async listTrending(currentUserId: string, page: number) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
      (SELECT
        COALESCE(SUM("Reaction"."value"), 0)
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      ((SELECT
        COALESCE(SUM("Reaction"."value"), 0)
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) / (DATE_PART('day', CURRENT_DATE - "Post"."createdAt") + 1)) AS trending_score
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      GROUP BY "Post"."id", "User"."id"
      ORDER BY trending_score DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async listFollowing(currentUserId: string, page: number) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
      (SELECT
        SUM("Reaction"."value")
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      LEFT JOIN "Follow" ON "Follow"."userId" = ${currentUserId} AND "Follow"."creatorId" = "Post"."userId"
      WHERE "Post"."userId" = "Follow"."creatorId"
      GROUP BY "Post"."id", "User"."id"
      ORDER BY "Post"."createdAt" DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async listBookmarked(currentUserId: string, page: number) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${currentUserId})) AS user,
      (SELECT
        SUM("Reaction"."value")
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      LEFT JOIN "Bookmark" ON "Bookmark"."userId" = ${currentUserId} AND "Bookmark"."postId" = "Post"."id"
      WHERE "Post"."id" = "Bookmark"."postId"
      GROUP BY "Post"."id", "User"."id"
      ORDER BY "Post"."createdAt" DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async listProfile(currentUserId: string, profileId: string, page: number) {
    const limit = 10;

    const rawPosts = await this.prisma.$queryRaw`
      SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${profileId})) AS user,
      (SELECT
        SUM("Reaction"."value")
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${currentUserId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Comment" WHERE "Comment"."postId" = "Post"."id" AND "Comment"."userId" = ${currentUserId}) AS commented,
      EXISTS(SELECT * FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id" AND "Bookmark"."userId" = ${currentUserId}) AS bookmarked
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      WHERE "Post"."userId" = ${profileId}
      GROUP BY "Post"."id", "User"."id"
      ORDER BY "Post"."createdAt" DESC
      OFFSET ${page * limit} ROWS
      FETCH NEXT ${limit} ROWS ONLY
    `;

    return this.serializeResult(rawPosts);
  }

  async remove(postId: string) {
    await this.prisma.post.delete({
      where: {
        id: postId,
      },
    });
    return { success: true };
  }

  async bookmark(userId: string, postId: string, value: boolean) {
    if (value) {
      this.notificationService.notifyBookmark({
        userId,
        postId,
      });
      const bookmark = await this.prisma.bookmark.create({
        data: {
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
      });
      return bookmark;
    } else {
      await this.prisma.bookmark.delete({
        where: {
          userId_postId: {
            userId,
            postId,
          },
        },
      });
      return { success: true };
    }
  }

  async unBookmark(userId: string, postId: string) {
    await this.prisma.bookmark.deleteMany({ where: { userId, postId } });
    return { success: true };
  }

  async react(userId: string, postId: string, value: number) {
    this.notificationService.notifyReaction({
      userId,
      postId,
      reaction: value,
    });
    const reaction = await this.prisma.reaction.upsert({
      where: {
        userId_postId: {
          userId,
          postId,
        },
      },
      update: {
        value,
      },
      create: {
        value,
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
    });
    return reaction;
  }

  async findOne(id: string, userId: string) {
    const rawPosts = await this.prisma.$queryRaw`
    SELECT 
      "Post"."id",
      "Post"."content",
      "Post"."createdAt",
      "Post"."updatedAt",
      JSON_BUILD_OBJECT('id', "User"."id", 'firstName', "User"."firstName", 'lastName', "User"."lastName", 'userName', "User"."userName", 'profilePic', "User"."profilePic", 'following', EXISTS(SELECT * FROM "Follow" JOIN "User" ON "User"."id" = "Follow"."userId" AND "Post"."userId" = "Follow"."creatorId" WHERE "User"."id" = ${userId})) AS user,
      (SELECT
        SUM("Reaction"."value")
        FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id"
      ) AS popularity,
      (SELECT COUNT(*) FROM "Comment" WHERE "Comment"."postId" = "Post"."id") AS comments,
      (SELECT COUNT(*) FROM "Bookmark" WHERE "Bookmark"."postId" = "Post"."id") AS bookmarks,
      (SELECT COUNT(*) FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id") AS reactions,
      COALESCE((SELECT "Reaction"."value" FROM "Reaction" WHERE "Reaction"."postId" = "Post"."id" AND "Reaction"."userId" = ${userId}), 0) AS reacted,
      EXISTS(SELECT * FROM "Bookmark" JOIN "User" ON "User"."id" = "Bookmark"."userId" AND "Bookmark"."postId" = "Post"."id" WHERE "User"."id" = ${userId}) AS bookmarked,
      EXISTS(SELECT * FROM "Comment" JOIN "User" ON "User"."id" = "Comment"."userId" AND "Comment"."postId" = "Post"."id" WHERE "User"."id" = ${userId}) AS commented
      FROM "Post"
      LEFT JOIN "User" ON "Post"."userId" = "User"."id"
      WHERE "Post"."id" = ${id}
      GROUP BY "Post"."id", "User"."id"
    `;
    return this.serializeResult(rawPosts)[0];
  }

  update(id: string, { content }: UpdatePostDto) {
    return this.prisma.post.update({
      where: { id },
      data: { content },
    });
  }

  serializeResult(rawPosts: any) {
    return rawPosts.map((item: any) => ({
      ...item,
      popularity: Number(item.popularity || 0),
      comments: Number(item.comments || 0),
      reactions: Number(item.reactions || 0),
      bookmarks: Number(item.bookmarks || 0),
    }));
  }
}
