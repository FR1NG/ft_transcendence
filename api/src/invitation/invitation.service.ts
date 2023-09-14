import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Invitation } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { CreateInvitationDto } from './dto/invitation.dto';
import { NotificationService } from 'src/notification/notification.service';

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService, private notificationService: NotificationService){}

  async createInvitation(user: AuthenticatedUser, data: CreateInvitationDto) {
    switch (data.type) {
      case 'FRIEND': return await this.createFrindInvit(user, data);
      case 'GAME': return await this.createGameInvit(user, data);
      case 'ROOM': return await this.createRoomInvit(user, data);
    }
  }

  async getInvitation(user: AuthenticatedUser, id: string) {
    const result = await this.prisma.invitation.findUnique({
      where: {
        id,
        toId: user.sub
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
    this.deleteInvitation(id);
  }

  private async acceptFrindInvit(user: AuthenticatedUser, id: Invitation) {

  }

  private async acceptGameInvit(user: AuthenticatedUser, id: Invitation) {

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
    this.deleteInvitation(invit.id);
    return {
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
  async deleteInvitation(id: string) {
    const result = await this.prisma.invitation.delete({
      where: {
        id
      }
    });
    return result;
  }

  //  create invitation 

  private async createGameInvit(user: AuthenticatedUser, data: CreateInvitationDto) {

  }

  private async createRoomInvit(user: AuthenticatedUser, data: CreateInvitationDto) {

  }

  private async createFrindInvit(user: AuthenticatedUser, data: CreateInvitationDto) {
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
      throw new ConflictException();
    const result = await this.prisma.invitation.create({
      data: {
        toId: data.userId,
        byId: user.sub,
        type: data.type
      }
    });
    if(result)
      this.notificationService.createNotification(data.userId, `${user.username} sent you a friend request`, `/users/${user.username}`);

    return result;
  }


}
