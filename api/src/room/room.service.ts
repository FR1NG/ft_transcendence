import { BadRequestException, ConflictException, ForbiddenException, HttpException, HttpStatus, Injectable,  Logger, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateRoomDto, JoinRoomDto, UpdateRoomDto, MuteUserDto } from './dto/room.dto';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import * as bcrypt from 'bcrypt'
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationService } from 'src/notification/notification.service';
import { SchedulerRegistry, Timeout } from '@nestjs/schedule';
import { Rooms, UsersRooms } from '@prisma/client';
import { MessagePaylod } from 'src/chat/dto/chat';

@Injectable()
export class RoomService {
  private logger = new Logger('rooms logger');
  constructor(
    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private notification: NotificationService,
    private scheduleRegestry: SchedulerRegistry,
  ) {}

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

    // emitting the joining event to the gateway
    this.eventEmitter.emit('room.join', {
      userId: id,
      roomId: result.id
    });

    return result;
  }


  // get rooms that the autenticated user is on
  async getUserRooms(user: AuthenticatedUser): Promise<any> {
    const { sub: id } = user;
    const userRooms = await this.prisma.users.findUnique({
      where: {
        id,
      },
      select: {
        rooms: {
          where: {
            baned: false,
          },
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
    return userRooms?.rooms || [];
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

    if (room.users.length > 0)
      throw new ConflictException('room is already joined');

    if (!room)
      throw new NotFoundException();

    if (room.type === 'PRIVATE')
      throw new ForbiddenException();

    if (room.type === 'PROTECTED') {
      const passwordMatch = await bcrypt.compare(password, room.password);
      if (!passwordMatch)
        throw new HttpException({
          message: 'Invalid password'
        }, HttpStatus.FORBIDDEN);
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

    if (joined) {
      this.eventEmitter.emit('room.join', {
        roomId: id,
        userId: user.sub
      })
      return { message: 'room joined successfully' };
    }
  }

  // get room by id
  async getRoom(user: AuthenticatedUser, id: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        user: {
          id: user.sub,
        },
        room: {
          id
        },
        baned: false,
      },
      select: {
        role: true,
        room: {
          select: {
            name: true,
            type: true,
            users: {
              select: {
                role: true,
                baned: true,
                user: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!room)
      throw new NotFoundException()
    const invitations = await this.prisma.invitation.findMany({
      where: {
        type: 'ROOM',
        byId: id
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    });
    const invitedUsers = invitations.map(el => el.user);
    room.room['invitedUsers'] = invitedUsers;
    return room;
  }

  async isInRoom(user: AuthenticatedUser, id: string) {
    const room = this.prisma.usersRooms.findFirst({
      where: {
        roomId: id,
        userId: user.sub
      }
    });
    if(room)
      return true;
    return false;
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
          where: {
            userId: user.sub
          },
          select: {
            baned: true,
          }
        }
      }
    });

    const filtred = [];
    rooms.forEach(el => {
      if (el.users.length > 0)
        el["joined"] = true;
      else
        el["joined"] = false;
      if(!el.users[0]?.baned) {
        filtred.push(el)
      }
      delete el["users"];
    })
    return filtred;
  }

  // make a user an admin of a room
  async addAdmin(roomId: string, userId: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        userId,
        roomId
      },
      select: {
        id: true,
        role: true
      }
    });

    if(!room)
      throw new NotFoundException('room not found');
    if(room.role === 'OWNER')
      throw new ForbiddenException('you cannot change the owner status');
    const result = await this.prisma.usersRooms.update({
      where: {
        id: room.id
      },
      data: {
        role: 'ADMIN'
      }
    });
    return result;
  }

  // remove admin role for a user
  async removeAdmin(roomId: string, userId: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        userId,
        roomId
      },
      select: {
        id: true,
        role: true
        }
    });

    if(!room)
      throw new NotFoundException('room not found');
    if(room.role === 'OWNER')
      throw new ForbiddenException('you cannot change the owner status');
    const result = await this.prisma.usersRooms.update({
      where: {
        id: room.id
      },
      data: {
        role: 'USER'
      }
    });
    return result;
  }

// kick a youser from a room
async kickUser(roomId: string, userId: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        userId,
        roomId
      },
      select: {
        id: true,
        role: true
        }
    });

    if(!room)
      throw new NotFoundException('room not found');
    if(room.role === 'OWNER')
      throw new ForbiddenException(`you cannot kick a ${room.role}, are you stupid`);
    const result = await this.prisma.usersRooms.delete({
      where: {
        id: room.id
      }
    });
    return result;
}


// ban a youser from a room
async banUser(roomId: string, userId: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        userId,
        roomId
      },
      select: {
        id: true,
        role: true
        }
    });

    if(!room)
      throw new NotFoundException('room not found');
    if(room.role === 'OWNER')
      throw new ForbiddenException(`you cannot kick a ${room.role}, are you stupid`);
    const result = await this.prisma.usersRooms.update({
      where: {
        id: room.id
      },
      data: {
        baned: true
      }
    });
    return result;
}
// unban a youser from a room
async unbanUser(roomId: string, userId: string) {
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        userId,
        roomId
      },
      select: {
        id: true,
        role: true
        }
    });

    if(!room)
      throw new NotFoundException('room not found');
    if(room.role === 'OWNER')
      throw new ForbiddenException(`you cannot kick a ${room.role}, are you stupid`);
    const result = await this.prisma.usersRooms.update({
      where: {
        id: room.id
      },
      data: {
        baned: false
      }
    });
    return result;
}
  // leave a room
  async leaveRoom(user: AuthenticatedUser, id: string) {
    const userRoom = await this.prisma.usersRooms.findFirst({
      where: {
        room: {
          id
        },
        user: {
          id: user.sub
        }
      },
      select: {
        id: true,
        role: true,
        room: {
          select: {
            id: true
          }
        },
      }
    });

    // checking number of users in the room
    const count = await this.prisma.usersRooms.count({
      where: {
        room: {
          id
        }
      }
    });

    if (count === 1) {
      await this.deleteRoom(id);
      return { message: 'room has been deleted because you are the only user in that room'};
    }

    if(userRoom.role === 'OWNER')
      this.transfereOwnership(user, id);

    await this.prisma.usersRooms.delete({
      where: {
        id: userRoom.id
      }
    });
    // emit event to the gateway
    this.eventEmitter.emit('room.leave', {
      roomId: id,
      userId: user.sub 
    })
    return { message: 'you leaved the room successfully' };
  }

  // update a room
  async updateRoom(id: string, data: UpdateRoomDto) {
    // checking password validity 
    const { name, type, password: newPassword } = data;
      const room = await this.prisma.rooms.findFirst({
        where: {
          id
        }
      });
    if(!room)
      throw new NotFoundException(`room with id ${id} not found`);
    if(room.type !== 'PROTECTED' && data.type === 'PROTECTED' && newPassword.length === 0)
      throw new BadRequestException(['password is required for protected rooms']);
    if(data.type === 'PROTECTED' && newPassword.length > 0) {
        const matches = await bcrypt.compare(data.oldPassword, room.password)
        if(!matches)
          throw new BadRequestException([ 'oldPassword is invalid' ]);
      // updateing password
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.prisma.rooms.update({
        where: {
          id
        },
        data: {
          password: hashedPassword
        }
      });
    }

    const result = await this.prisma.rooms.update({
      where: {
        id
      },
      data : {
        name,
        type
      },
    });
    const {password, ...rest} = result;
    return rest;
  }


  // creating room invitation for a user
  async createInvitation(user: AuthenticatedUser, roomId: string, userId: string) {
    const room = await this.prisma.rooms.findUnique({
      where: {
        id: roomId
      },
      select: {
        id: true,
        name: true
      }
    });
    if(!room)
      throw new NotFoundException('room not found');
    const result = await this.prisma.invitation.create({
      data: {
        byId: roomId,
        toId: userId,
        type: 'ROOM'
        }
    });
    const content = `${user.username} sent you invitation to join ${room.name}`;
    const link = `/chat/invitation/${result.id}`;
    this.notification.createNotification(userId, content, link);
    return result;
  }


  // delete room invitation
  async deleteInvitation(roomId: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: {
        byId_toId_type: {
          byId: roomId,
          toId: userId,
          type: 'ROOM'
        },
      },
    });

    if(!invitation)
      throw new NotFoundException('this user is not invited to this room');

    const result = await this.prisma.invitation.delete({
      where: {
        id: invitation.id
      }
    });
    return result;
  }

  // delete room 
  async deleteRoom(id: string) {
    await this.prisma.usersRooms.deleteMany({
      where: {
        room: {
          id
        }
      }
    });

    const result = await this.prisma.rooms.delete({
        where: {
          id
        }
      });
    return result;
  }


  // transfere ownership
  async transfereOwnership(user: AuthenticatedUser, id: string) {
      let lkhalifa = await this.prisma.usersRooms.findFirst({
        where: {
          room: {
            id
          },
          OR: [
            { role: 'ADMIN'},
          ],
          NOT: [
            {
              user: {
                id: user.sub
              }
            }
          ]
        }
      });
      // if no admin in the room
      if (!lkhalifa) {
        lkhalifa = await this.prisma.usersRooms.findFirst({
          where: {
            room: {
              id
            },
            NOT: [
              {
                user: {
                  id: user.sub
                }
              }
            ]
          }
        });
      }

      // update room owner id to the new owner
      const room = await this.prisma.rooms.update({
        where: {
          id
      },
        data: {
          ownerId: lkhalifa.userId
        }
      });

      // update the user's role in the room
      const newUserRoom = await this.prisma.usersRooms.update({
        where: {
          id: lkhalifa.id
        },
        data: {
          role: 'OWNER'
        }
      });

  }

  private async unmute(room: UsersRooms) {
    await this.prisma.usersRooms.update({
      where: {
        id: room.id
      },
      data: {
        muted: false
      }
    });

    this.scheduleRegestry.deleteTimeout(`unmute${room.id}`);
    this.logger.verbose('user has been unmuted');
  }


  // timeout to unmute room user
  async mute(data: MuteUserDto) {
    const allowedTime = [
      5,
      10,
      15,
      30
    ];

    if(!allowedTime.includes(data.time))
      throw new BadRequestException(['time is invalid'])
    const userRoom = await this.prisma.usersRooms.findFirst({
      where: {
        roomId: data.roomId,
        userId: data.userId
      },
      include: {
        user: true
      }
    });
    if(!userRoom)
      throw new NotFoundException('room not found or user is not a member of this room');

    // muting user
    const room = await this.prisma.usersRooms.update({
      where: {
        id: userRoom.id
      },
      data: {
        muted: true
      }
    });
    

    // setting the timeout
    const timeout = setTimeout(async () =>  this.unmute(room), data.time * 60000);
    try {
      this.scheduleRegestry.addTimeout(`unmute${room.id}`, timeout);
      this.logger.verbose(`user '${userRoom.user.username}' has been muted`);
    } catch(error) {
      clearTimeout(timeout);
      throw new ConflictException('user is already muted');
    }
    return { message: `${userRoom.user.username} has been muted successfully for ${data.time} minutes`};
  }

  // check if user able to send message to room
  async isUserAbleToSend(user: AuthenticatedUser, payload: MessagePaylod) {
    const userRoom = await this.prisma.usersRooms.findFirst({
      where: {
        userId: user.sub,
        roomId: payload.recieverId
      },
    });

    if(!userRoom || userRoom.baned || userRoom.muted)
      return false;
    return true;
  }
}

