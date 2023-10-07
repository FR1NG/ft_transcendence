import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Invitation } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { CreateInvitationDto } from './dto/invitation.dto';
import { NotificationService } from 'src/notification/notification.service';
import { UserService } from 'src/user/user.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GameService } from 'src/game/game.service';

@Injectable()
export class InvitationService {
  constructor(
    private prisma: PrismaService,
    private notificationService: NotificationService,
    private userService: UserService,
    private emiter: EventEmitter2,
    private gameService: GameService
  ){}

  async createInvitation(user: AuthenticatedUser, data: CreateInvitationDto) {
    switch (data.type) {
      case 'FRIEND': return await this.createFriendInvit(user, data);
      case 'GAME': return await this.createGameInvit(user, data);
      case 'ROOM': return await this.createRoomInvit(user, data);
    }
  }

  async getInvitation(user: AuthenticatedUser, id: string) {
    const result = await this.prisma.invitation.findUnique({
      where: {
        id,
        toId: user.sub
      },
      include: {
        notification: {
          select: {
            id: true,
            link: true,
            content: true,
          }
        }
      }
    });
    if(!result)
      throw new NotFoundException('invitation not found');
    const inviter = await this.getInviter(result);

    result['inviter'] = inviter;
    return result;
  }

  async acceptInvitation(user: AuthenticatedUser, id: string) {
    const invit = await this.prisma.invitation.findUnique({
      where: {
        id,
        toId: user.sub
      }
    });
    if(!invit)
      throw new NotFoundException('invitation not found');
    switch (invit.type) {
      case 'FRIEND': return await this.acceptFrindInvit(user, invit);
      case 'GAME': return await this.acceptGameInvit(user, invit);
      case 'ROOM': return await this.acceptRoomInvit(user, invit);
    }
  }

  async declineInvitation(user: AuthenticatedUser, id: string) {
    const invit = await this.prisma.invitation.findUnique({
      where: {
        id,
        toId: user.sub
      }
    });
    if(!invit)
      throw new NotFoundException('invitation not found');
    this.deleteInvitation(invit.byId, id);
  }

  private async acceptFrindInvit(user: AuthenticatedUser, invit: Invitation) {
    const inviter = await this.prisma.users.findUnique({
      where: {
        id: invit.byId
      }
    });

    if(!inviter)
      throw new NotFoundException('inviter not found');
    const block = await this.userService.isBlock(user, inviter.id);
    if(block)
      throw new ForbiddenException();
    await this.prisma.friends.create({
      data: {
        friendId: user.sub,
        friendOfId: inviter.id
      }
    });
    this.deleteInvitation(inviter.id, invit.id);

      this.emiter.emit('hot.reload', {
      userId: invit.byId,
      scope: 'user'
    });
    return { message: `you and ${inviter.username} are friends now` };
  }

  private async acceptGameInvit(user: AuthenticatedUser, invit: Invitation) {
    this.emiter.emit('game.invite', {user, invitationId: invit.id});
    this.deleteInvitation(invit.byId, invit.id);
  }

  private async acceptRoomInvit(user: AuthenticatedUser, invit: Invitation) {
    const result = await this.prisma.usersRooms.create({
      data: {
        user: {
          connect: {
            id: user.sub
          }
        },
        room: {
          connect : {
            id: invit.byId
          }
        }
      }
    });
    if(!result)
      throw new InternalServerErrorException();
    this.deleteInvitation(result.roomId, invit.id);
    return {
      roomId: result.roomId,
      message: 'you hanve joined the room',
    };
  }

  // get inviter depending on the invitation type
  private async getInviter(invitation: Invitation) {
    switch(invitation.type) {
      case 'FRIEND': return await this.prisma.users.findUnique({where: {id: invitation.byId}, select: {id: true, username: true}});
      case 'GAME': return await this.prisma.users.findUnique({where: {id: invitation.byId}, select: {id: true, username: true}});
      case 'ROOM': return await this.prisma.rooms.findUnique({where: {id: invitation.byId}, select: {id: true, name: true}});
    }
  }

  // delete the invitation
  async deleteInvitation(inviterId: string, id: string) {
    const result = await this.prisma.invitation.delete({
      where: {
        id,
        byId: inviterId
      },
      include: {
        notification: true
      }
    });
    if(result.notification) {
        await this.prisma.notifications.deleteMany({
        where: {
          id: result.notification.id
        }
      });
    }
    return result;
  }

  //  create invitation 
  private async createGameInvit(user: AuthenticatedUser, data: CreateInvitationDto) {
    const guest = await this.prisma.users.findUnique({
      where: {
        id: data.userId
      },
      select: {
        id: true,
        isInGame: true,
        username: true,
      }
    });
    const host = await this.prisma.users.findUnique({
      where: {
        id: user.sub,
      },
      select: {
        id: true,
        isInGame: true,
      }
    });
    if (!guest)
      throw new NotFoundException('user you trying to invite not found');
    if(guest.isInGame)
      throw new ConflictException(`${guest.username} already in a game`);
    if(host.isInGame)
      throw new ConflictException('you can\'t send invitation to a game, you are already in a game');
    const result = await this.checkAndCreate(user, data);
    const notification = await this.notificationService.createNotification(data.userId, `${user.username} sent you invitation to play a game`, `/invitation/${result.id}`);
    await this.prisma.invitation.update({
      where: {
        id: result.id
      },
      data: {
        notification: {
          connect: {
            id: notification.id
          }
        }
      }
    });
    // emitting event to join the game
    this.emiter.emit('game.invite', {user, invitationId: result.id});
    return  result;
  }

  private async createRoomInvit(user: AuthenticatedUser, data: CreateInvitationDto) {

  }

  private async createFriendInvit(user: AuthenticatedUser, data: CreateInvitationDto) {
    const isFriend = await this.userService.isFriend(user, data.userId);
    if(isFriend)
      throw new ConflictException(`you are already friends`);
    const result = await this.checkAndCreate(user, data);
    const notification = await this.notificationService.createNotification(data.userId, `${user.username} sent you a friend request`, `/users/${user.username}`);
    const connected = await this.prisma.invitation.update({
      where: {
        id: result.id
      },
      data: {
        notificationId: notification.id
      }
    });
    this.emiter.emit('hot.reload', {
      userId: data.userId,
      scope: 'user'
    });
    return connected;
  }

  // check if invitation aleardy exist and create it if not
  private async checkAndCreate(user: AuthenticatedUser, data: CreateInvitationDto) {
    const count = await this.prisma.invitation.count({
      where: {
        OR: [
          { toId: user.sub, byId: data.userId},
          { byId: user.sub, toId: data.userId},
        ],
        type: data.type
      }
    });
    if(count !== 0)
      throw new ConflictException('invitation aleardy sent');
    const result = await this.prisma.invitation.create({
      data: {
        toId: data.userId,
        byId: user.sub,
        type: data.type
      }
    });
    return result;
  }

  // getting created game by invitation id
  async getGameByInvit(id: string) {
    const invit = await this.prisma.invitation.findUnique({
      where: {
        id
      }
    });
    if(!invit)
      return null;
    const game = await this.prisma.games.findFirst({
      where: {
        hostId: invit.byId,
        guestId: invit.toId,
        status: 'CREATED'
      }
    });
    return game;
  }

}
