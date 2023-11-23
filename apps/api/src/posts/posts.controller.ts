import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { GetAuth } from 'src/auth/auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { AuthGuard } from 'src/auth/auth.guard';
import { listType } from './entities/listType.entity';
import { UserGuard } from 'src/auth/user.guard';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseGuards(AuthGuard)
  create(@GetAuth() { userId }: Auth, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, userId);
  }

  @Get()
  @UseGuards(UserGuard)
  listRecentPosts(
    @GetAuth() { userId }: Auth,
    @Query('page') page: number = 0,
    @Query('type')
    type: listType = 'recent',
  ) {
    return this.postsService.list(userId, page, type);
  }

  @Get('search')
  @UseGuards(UserGuard)
  listSearchResults(
    @GetAuth() { userId }: Auth,
    @Query('page') page: number = 0,
    @Query('query') query: string,
  ) {
    return this.postsService.search(userId, page, query);
  }

  @Get(':id')
  @UseGuards(UserGuard)
  findOne(@GetAuth() { userId }: Auth, @Param('id') id: string) {
    return this.postsService.findOne(id, userId);
  }

  @Get('profile/:id')
  @UseGuards(UserGuard)
  listProfile(
    @GetAuth() { userId }: Auth,
    @Param('id') profileId: string,
    @Query('page') page: number = 0,
  ) {
    return this.postsService.listProfile(userId, profileId, page);
  }

  @Post('react/:id')
  @UseGuards(AuthGuard)
  react(
    @GetAuth() { userId }: Auth,
    @Param('id') postId: string,
    @Body('value') value: string,
  ) {
    return this.postsService.react(userId, postId, +value);
  }

  @Post('bookmark/:id')
  @UseGuards(AuthGuard)
  bookmark(
    @GetAuth() { userId }: Auth,
    @Param('id') postId: string,
    @Body('value') value: boolean,
  ) {
    return this.postsService.bookmark(userId, postId, value);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.postsService.remove(id);
  }
}
