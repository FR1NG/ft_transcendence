import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FriendRequestStatus, Friends } from '@prisma/client';
import { AuthenticatedUser } from 'src/types';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FriendService {
  constructor(
    private prisma: PrismaService,
    private emiter: EventEmitter2
  ) { }

  async getFriends(user: AuthenticatedUser) {
      const friends = await this.prisma.friends.findMany({
      where: {
        OR: [
          {friendId: user.sub},
          {friendOfId: user.sub}
        ],
      },
      select: {
        friendWith: {
          select: {
            id: true,
            avatar: true,
            username: true,
            isInGame: true,
            isOnline: true
          }
        },
        friendOf: {
          select: {
            id: true,
            avatar: true,
            username: true,
            isInGame: true,
            isOnline: true
          }
        }
      }
    });
    return this.filterFriends(user, friends);
  }

  filterFriends(user: AuthenticatedUser, friends: any) {
    const mergedFriends = [];
    friends.forEach((el: any) => {
      if(el.friendOf.id !== user.sub) {
        if (el.friendOf.isOnline)
          el.friendOf['status'] = 'online';
        else
          el.friendOf['status'] = 'offline';
        if (el.friendOf.isInGame)
          el.friendOf['status'] = 'in game';
        mergedFriends.push(el.friendOf);
      }
      else {
        if (el.friendWith.isOnline)
          el.friendWith['status'] = 'online';
        else
          el.friendWith['status'] = 'offline';
        if (el.friendWith.isInGame)
          el.friendWith['status'] = 'in game';
          
        mergedFriends.push(el.friendWith);
      }
    });
    return mergedFriends;
  }

  async sendFrienRequest(authenticatedId: string, requestedId: string) {
    // finding reqeust
    const requestSent = await this.prisma.friendRequests.findFirst({
      where: {
        senderId: authenticatedId
      }
    });
    if(requestSent)
      throw new HttpException('request already sent', HttpStatus.CONFLICT);
    // confirm if other user alredy sent the request
   const requestRecieved = await this.prisma.friendRequests.findFirst({
      where: {
        recieverId: authenticatedId
      }
    });
    if(requestRecieved)
      return this.confirmFriendRequest({sub: authenticatedId} as AuthenticatedUser, requestRecieved.id);
    const friendShip = await this.prisma.friendRequests.create({
      data: {
        senderId: authenticatedId,
        recieverId: requestedId,
      }
    })
    return friendShip;
  }

  async confirmFriendRequest(auth: AuthenticatedUser, id: number) {
    // TODO implement middleware to check if user able to confim this frind request
    try {
      const friendRequest = await this.prisma.friendRequests.update({
        where: {
          id
        },
        data: {
          status: FriendRequestStatus.CONFIRMED,
        },
        include: {
          sender: {
            select: {
              id: true,
            }
          },
          reciever: {
            select: {
              id: true
            }
          }
        }
      });

      if(friendRequest.reciever.id !== auth.sub)
        throw new HttpException('action not permitted', HttpStatus.UNAUTHORIZED);

      const friendship = await this.prisma.friends.create({
        data: {
          friendOf: {
            connect: {
                id: auth.sub
            }
          },
          friendWith: {
            connect: {
              id: friendRequest.sender.id
            }
          }
        } 
      });
      return friendship;
    } catch (error) {
      throw error;
    }
  }

  async unfriend(user: AuthenticatedUser, userId: string) {
    const friend = await this.prisma.friends.findFirst({
      where: {
        OR: [
          { friendOfId: user.sub, friendId: userId},
          { friendOfId: userId, friendId: user.sub},
        ]
      }
    });
    if(!friend)
      throw new NotFoundException();
    const result = await this.prisma.friends.delete({
      where: {
        id: friend.id
      }
    });

    this.emiter.emit('hot.reload', {
      userId: userId,
      scope: 'user'
    });
    return result;
  }

  async getSentRequests(id: string) {
    const requests = await this.prisma.friendRequests.findMany({
      where: {
        senderId: id,
      },
      select: {
        id: true,
        status: true,
        reciever: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true
          }
        },
      }
    });
    return requests;
  }

  // getting online friends
  async getOnlineFriends(auth: AuthenticatedUser) {
    const friends = await this.prisma.users.findFirst({
      where: {
        id: auth.sub
      },
      select: {
        friendOf: {
          select: {
            friendWith: true
          }
        },
        friendWith: {
          select: {
            friendOf:true
         }
        }
      }
    }) 
    const filtredFriends = []
    friends?.friendWith.forEach(friend => {
      if(friend.friendOf.isOnline) filtredFriends.push(friend.friendOf)
    })

    friends?.friendOf.forEach(friend => {
      if(friend.friendWith.isOnline) filtredFriends.push(friend.friendWith)
    })
    return filtredFriends;
  }

  // getting all blocked users
  async getBlocked(user: AuthenticatedUser) {
    const  blocked = await this.prisma.block.findMany({
      where: {
        OR: [
          {blockedId: user.sub},
          {blockerId: user.sub}
        ]
      },
      select: {
        blocked: {
          select: {
            id: true
          }
        },
        blockedBy: {
          select: {
            id: true
          }
        }
      }
    });

    const filtredBlocked = [];
    blocked.forEach(el => {
      if(el.blocked.id !== user.sub)
        filtredBlocked.push(el.blocked.id)
      if(el.blockedBy.id !== user.sub)
        filtredBlocked.push(el.blockedBy.id)
    });
    return filtredBlocked;
  }
}
