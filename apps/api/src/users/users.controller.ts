import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetAuth } from 'src/auth/auth.decorator';
import { Auth } from 'src/auth/entities/auth.entity';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  findCurrent(@GetAuth() { userId }: Auth) {
    return this.usersService.findOne(userId);
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  uploadFile(
    @GetAuth() { userId }: Auth,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.usersService.uploadProfilePic(image, userId);
  }

  @Post('follow/:id')
  @UseGuards(AuthGuard)
  follow(@GetAuth() { userId }: Auth, @Param('id') creatorId: string) {
    return this.usersService.follow(userId, creatorId);
  }

  @Delete('follow/:id')
  @UseGuards(AuthGuard)
  unfollow(@GetAuth() { userId }: Auth, @Param('id') creatorId: string) {
    return this.usersService.unfollow(userId, creatorId);
  }

  @Get('stats/:id')
  stats(@Param('id') userId: string) {
    return this.usersService.stats(userId);
  }

  @Get('username/:value')
  @UseGuards(AuthGuard)
  username(@Param('value') userName: string) {
    return this.usersService.userName(userName);
  }

  @Get('followers/:id')
  followers(@Param('id') userId: string) {
    return this.usersService.followers(userId);
  }

  @Get('following/:id')
  following(@Param('id') userId: string) {
    return this.usersService.following(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
