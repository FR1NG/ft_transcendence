import { Injectable, NotFoundException } from '@nestjs/common';
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
      case 'FRIEND': return await this.acceptFrindInvit(id);
      case 'GAME': return await this.acceptGameInvit(id);
      case 'ROOM': return await this.acceptRoomInvit(id);
    }
  }

  async acceptFrindInvit(id: string) {

  }

  async acceptGameInvit(id: string) {

  }

  async acceptRoomInvit(id: string) {

  }

}
