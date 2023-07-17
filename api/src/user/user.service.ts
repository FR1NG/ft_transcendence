import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilterUserDto } from './dto/filter-user.dto';
import { AuthenticatedUser } from 'src/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService, private config: ConfigService) { }

  async create(createUserDto: CreateUserDto) {
    const user = await this.prisma.users.create({
      data: createUserDto,
    });
    return user;
  }

  async findAll() {
    const users = await this.prisma.users.findMany({
      select: {
        id: true,
        username: true,
        avatar: true,
        isOnline: true,
      }
    });
    return users;
  }

  findOne(id: number) {
    return 'find uno';
  }

  async findUser(where, auth: any) {
    const user = await this.prisma.users.findUnique({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isOnline: true,
        friendRequestsSent : {
          where: {
            recieverId: auth.sub
          },
          select: {
            id: true,
            status: true
          }
        },
        friendRequestsRecieved: {
          where: {
            senderId: auth.sub,
          },
          select: {
            id: true,
            status: true
          }
        }
      },
    });
    // TODO change this with the correct error
    if(!user)
      console.log('not found');
    return user;
  }

  async findUserById(id: number) {
    const user = await this.prisma.users.findUnique({
      where: {
        intra_id: id,
      },
    });
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const result = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        username: updateUserDto.username,
        email: updateUserDto.email,
      },
    });
    return {message: 'profile updated successfully'};
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async getProfile(id: string) {
    const profile = await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        username: true,
        email: true,
        avatar: true,
      },
    });
    if (!profile) {
      // not sure about this
      throw new NotFoundException();
    }

    return profile;
  }

  async updateAvatar(id: string, fileName: string): Promise<any> {
    const path = `${this.config.get('CDN_URL')}/users/${fileName}`;
    const result = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        avatar: path,
      },
    });
    return { message: 'Avatar has been updated successfully' };
  }

  async setOnline(id: string, value: boolean): Promise<any> {
    const result = await this.prisma.users.update({
      where: {
        id,
      },
      data: {
        isOnline: value,
      }
    });
    return result;
  }

  // search for a user
  async searchUser(pattern: string, auth: AuthenticatedUser): Promise<any> {
    const users = await this.prisma.users.findMany({
      where: {
        username: {
          contains: pattern,
          mode: 'insensitive'
        },
      NOT: {
        id: auth?.sub
      }
      },
    });

    return users;
  }


}
