import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma.service';
import { ConfigService } from '@nestjs/config';
import { FilterUserDto } from './dto/filter-user.dto';
import { AuthenticatedUser } from 'src/types';
import { Prisma } from '@prisma/client';

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

  async findUser(where, auth: AuthenticatedUser) {
    const user = await this.prisma.users.findUnique({
      where,
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isOnline: true,
        points: true,
        achievments: true,
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
            },
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
    delete user['_count'];
    // getting friendshipt status
   const friendship = await this.getFriendShipStatus(auth, user.id);
    user['friendshipStatus'] = friendship.status;
    user['invitationId'] = friendship.invitationId;
    user['friendsCount'] = await this.friendsCount(auth);
    // getting games
    user['games'] = await this.getUserGames(user.id);
    user['winsCount'] = user['games'].filter((el: any) => el.winnerId === user.id).length;
    user['loseCount'] = user['games'].filter((el: any) => el.winnerId !== user.id).length;
    user['rank'] = await this.getRank(user.id);
    user['leaderboard'] = await this.getLeaderboard();
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

  private async friendsCount(user: AuthenticatedUser): Promise<number> {
    const friends = await this.prisma.friends.findMany({
      where: {
        OR:[
          {friendId: user.sub},
          {friendOfId: user.sub}
        ]
      },
      select: {
        id: true,
      }
    });

    if(friends)
      return friends.length;
    return 0;
  }

  async update(user: AuthenticatedUser, updateUserDto: UpdateUserDto) {
    const result = await this.prisma.users.update({
      where: {
        id: user.sub,
      },
      data: {
        username: updateUserDto.username.trim(),
        email: updateUserDto.email.trim(),
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
        isOtpActivated: true
      },
    });
    if (!profile)
      throw new NotFoundException();

    return profile;
  }

  async updateAvatar(user: AuthenticatedUser, fileName: string, append = true): Promise<any> {
    let path = fileName;
    if(append)
       path = `${this.config.get('CDN_URL')}/users/${fileName}`;

    await this.prisma.users.update({
      where: {
        id: user.sub,
      },
      data: {
        avatar: path,
      },
    });
    return { message: 'Avatar has been updated successfully' };
  }

  async setOnline(id: string, value: boolean): Promise<any> {
    const user = await this.prisma.users.findFirst({
      where: {
        id
      },
      select: {
        id: true
      }
    });
    if(!user)
      return null;
    const result = await this.prisma.users.update({
      where: {
        id: user.id,
      },
      data: {
        isOnline: value || false,
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

  // is one of the users block the other
  async isBlock(user: AuthenticatedUser, userId: string): Promise<Boolean> {
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          {blockerId: user.sub, blockedId: userId},
          {blockerId: userId, blockedId: user.sub},
        ]
      }
    });
    if(block)
      return true;
    return false;
  }

  // is a user friend or not
  async isFriend(user: AuthenticatedUser, userId: string): Promise<Boolean> {
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

  private async isInvited(user: AuthenticatedUser, userId: string): Promise<{status: FriendshipStatus, invitationId: string}> {
    const invitation = await this.prisma.invitation.findFirst({
      where: {
        OR:[
          { toId: userId, byId: user.sub },
          { toId: user.sub, byId: userId }
        ],
        type: 'FRIEND'
      }
    });
    
    if(!invitation)
      return {status: 'NONE', invitationId: ''};
    if(invitation.byId === userId)
      return {status: 'INVITATION_RECIEVED', invitationId: invitation.id};
    else 
      return {status: 'INVITATION_SENT', invitationId: invitation.id};
  }

  private async getFriendShipStatus(user: AuthenticatedUser, userId: string): Promise<{status: FriendshipStatus, invitationId: string}> {
   const friends = await this.isFriend(user, userId);
    if(friends)
      return {status: 'FRIENDS', invitationId: ''};
    return await this.isInvited(user, userId);
  }

  // getting the user games with a specific user
  async getUserGames(userId: string) {
    const games = await this.prisma.games.findMany({
      where: {
        OR: [
          {guestId: userId},
          {hostId: userId},
        ],
        status: 'FINISHED'
      },
      select: {
        id: true,
        status: true,
        winnerId: true,
        winnerScore: true,
        loserScore: true,
        created_at: true,
        guest: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        },
        host: {
          select: {
            id: true,
            username: true,
            avatar: true,
          }
        }
      }
    });
    return games;
  }

  async getRank(userId: string) {
    const users = await this.prisma.users.findMany({
      select: {
        id: true
      },
      orderBy:{
        points: 'desc',
      },
    });
    const index = users.findIndex(user => user.id === userId);
    if (index >= 0)
      return index + 1;
    return 0;
  }

  async getLeaderboard() {
    const users = await this.prisma.users.findMany({
      orderBy: {
        points: 'desc'
      },
      take: 3,
      select: {
        id: true,
        username: true,
        points: true,
        avatar: true
      }
    });
    return users;
  }

}
