import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
  Req,
  InternalServerErrorException,
  UseFilters,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from 'src/auth/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ValidationExceptionFilterFilter } from 'src/exception-filters/validation.filter';
import { AuthPayload } from './dto/auth-payload';

@Controller('user')
@UseFilters(ValidationExceptionFilterFilter)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get('profile')
  @UseGuards(AuthGuard)
  async getProfile(@Request() request: any) {
    const { sub } = request.user;

    return await this.userService.getProfile(sub);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  update(@Request() request, @Body() updateUserDto: UpdateUserDto) {
    const { sub } = request.user;
    return this.userService.update(sub, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }

  // avatart routes
  @Post('avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar', {
    storage: diskStorage({
      destination: './uploads/users',
      filename: (request , file, cb) => {
        const user: AuthPayload  = request.user as AuthPayload;
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${user.sub}${extname(file.originalname)}`);
      },
    }),
  })
  )
  async uploadAvatar(
    @UploadedFile() file: Express.Multer.File,
    @Req() request,
  ) {
    // to be changed to the right exception
    if (!file) throw new InternalServerErrorException();
    const { sub } = request.user;
    return await this.userService.updateAvatar(sub, file.filename);
  }
}
