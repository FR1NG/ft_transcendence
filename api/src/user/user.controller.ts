import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
  UseGuards,
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
      filename: (req, file, cb) => {
        // Generating a 32 random chars long string
        const randomName = Array(32).fill(null).map(() => (Math.round(Math.random() * 16)).toString(16)).join('')
        //Calling the callback passing the random name generated with the original extension name
        cb(null, `${randomName}${extname(file.originalname)}`);
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
