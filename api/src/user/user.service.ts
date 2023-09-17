import { ForbiddenException, HttpException, HttpStatus, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilterUserDto } from './dto/filter-user.dto';
import { AuthenticatedUser } from 'src/types';

type FriendshipStatus = 'FRIENDS' | 'INVITATION_SENT' | 'INVITATION_RECIEVED' | 'NONE'
type InvitationStatus = 'SENT' | 'RECIEVED' | 'NONE'
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

  async findUser(where, auth: AuthenticatedUser) {
    const user = await this.prisma.users.findUnique({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isOnline: true,
        _count: {
          select: {
            blockedBy: {
              where: {
                blockerId: auth.sub
              }
            },
            blocked: {
              where: {
                blockedId: auth.sub
              }
            }
          }
        }
      },
    });

    if(!user)
      throw new NotFoundException();

    // checking if the searched user is blocking the current user
    if(user._count.blocked > 0)
      throw new ForbiddenException();

    user['blocked'] = false;
    if(user._count.blockedBy > 0)
      user['blocked'] = true;

    delete user['_count']['blockedBy'];
    delete user['_count']['blocked'];

    // getting friendshipt status
    user['friendshipStatus'] = await this.getFriendShipStatus(auth, user.id);

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

// block a user
  async blockUser(id: string, auth: AuthenticatedUser) {
    const user = await this.prisma.users.update({
        where: {
          id
        },
        data: {
          blockedBy: {
            create: {
              blockerId: auth.sub
            }
          }
        }
      });

      if (!user) {
        console.log('user no existoo')
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      return user;
  }

  // unblock user
  async unblockUser(id: string, auth: AuthenticatedUser) {
    const user = await this.prisma.users.findUnique({
      where: {
        id
      },
      select: {
        blockedBy: {
          where: {
            blockerId: auth.sub
          },
          select: {
            id: true
          }
        }
      }
    });

    if(user.blockedBy.length > 0) {
      const result = await this.prisma.block.delete({
        where: {
          id: user.blockedBy[0].id
        }
      });
      return result;
    }
    return user;
  }

  // is a user friend or not
  private async isFriend(user: AuthenticatedUser, userId: string): Promise<Boolean> {
    const friendship = await this.prisma.friends.findFirst({
      where: {
        OR: [
          {friendOfId: user.sub, friendId: userId},
          {friendOfId: userId, friendId: user.sub},
        ]
      }
    });
    if(friendship)
      return true;
    return false;
  }

  private async isInvited(user: AuthenticatedUser, userId: string): Promise<FriendshipStatus> {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        OR:[
          { toId: userId, byId: user.sub },
          { toId: user.sub, byId: userId }
        ]
      }
    });
    console.log(user);
    if(!invitation)
      return 'NONE';
    if(invitation.byId === userId)
      return 'INVITATION_RECIEVED';
    else 
      return 'INVITATION_SENT';
  }

  private async getFriendShipStatus(user: AuthenticatedUser, userId: string): Promise<FriendshipStatus> {
   const friends = await this.isFriend(user, userId);
    if(friends)
      return 'FRIENDS';
    return await this.isInvited(user, userId);
  }

}
