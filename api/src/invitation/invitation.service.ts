import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Invitation } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';

@Injectable()
export class InvitationService {
  constructor(private prisma: PrismaService){}

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

}
