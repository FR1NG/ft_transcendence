import { ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRoomDto, JoinRoomDto } from './dto/room.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import * as bcrypt from 'bcrypt'
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { UsersRooms } from '@prisma/client';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class RoomService {
  constructor(private prisma: PrismaService, private casl: CaslAbilityFactory) { }
  async createRoom(user: AuthenticatedUser, room: CreateRoomDto) {
    const { name, type, password } = room;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const { sub: id } = user;
    const result = await this.prisma.rooms.create({
      data: {
        name,
        type,
        password: hashedPassword,
        owner: {
          connect: {
            id,
          },
        },
        conversation: {
          create: {
          }
        },
        users: {
          create: {
            user: {
              connect: {
                id
              }
            },
            role: 'OWNER'
          }
        }
      },
    });
    return result;
  }


  // get rooms that the autenticated user is on
  async getUserRooms(user: AuthenticatedUser) {
    const { sub: id } = user;
    const userRooms = await this.prisma.users.findUnique({
      where: {
        id
      },
      select: {
        rooms: {
          select: {
            role: true,
            room: {
              select: {
                id: true,
                name: true,
              }
            }
          }
        }
      }
    });
    return userRooms.rooms;
  }

  // getting all users in a room
  async getRoomUsers(user: AuthenticatedUser, id: string) {
    const room = await this.prisma.rooms.findUnique({
      where: {
        id,
      },
      select: {
        users: {
          select: {
            user: true
          }
        }
      }
    });
    return room.users;
  }

  // join a room
  async joinRoom(user: AuthenticatedUser, data: JoinRoomDto) {
    const { id, password } = data;
    const room = await this.prisma.rooms.findUnique({
      where: {
        id
      },
      select: {
        id: true,
        type: true,
        password: true,
        users: {
          where: {
            userId: user.sub
          },
        }
      }
    });

    if(room.users.length > 0)
      throw new ConflictException('room is already joined');

    if (!room)
      throw new NotFoundException();

    if (room.type === 'PRIVATE')
      throw new UnauthorizedException();

    if (room.type === 'PROTECTED') {
      const passwordMatch = await bcrypt.compare(password, room.password);
      if (!passwordMatch)
      throw new HttpException({
        message: 'Invalid password'
      }, HttpStatus.UNAUTHORIZED);
    }

    const joined = await this.prisma.users.update({
      where: {
        id: user.sub
      },
      data: {
        rooms: {
          create: {
            roomId: id,
            role: 'USER'
          }
        }
      }
    });

    if (joined)
      return { message: 'room joined successfully' };
  }

  // get room by name
  async getRoom(user: AuthenticatedUser, id: string) {

    const room = await this.prisma.usersRooms.findFirst({
      where: {
        user: {
          id: user.sub
        },
        room: {
          id
        }
      },
    });

    if(!room)
      throw new NotFoundException('')
    const ability = this.casl.createForRoom(room);
    if(!ability.can(Actions.read, 'room'))
      throw new ForbiddenException('you can\'t see this room')
    return room;
  }


  // search for a room
  async searchRoom(user: AuthenticatedUser, pattern: string) {
    const rooms = await this.prisma.rooms.findMany({
      where: {
        name: {
          contains: pattern,
          mode: 'insensitive'
        },
        NOT: {
          type: 'PRIVATE'
        }
      },
      select: {
        id: true,
        name: true,
        type: true,
        users: {
          where : {
            userId: user.sub
          }
        }
      }
    });

    const filtred = rooms.map(el => {
      if(el.users.length > 0)
       el["joined"] = true;
      else
       el["joined"] = false;
      delete el["users"];
      return el;
    })
    return filtred;
  }
}

