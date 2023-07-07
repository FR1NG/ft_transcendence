import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FriendRequestStatus } from '@prisma/client';

@Injectable()
export class FriendService {
  constructor(private prisma: PrismaService) { }

  async sendFrienRequest(authenticatedId: string, requestedId: string) {
    const friendShip = await this.prisma.friendRequests.create({
      data: {
        senderId: authenticatedId,
        recieverId: requestedId,
      }
    })
    return friendShip;
  }

  async cancelRequest(user: any, id: number) {
    const result = await this.prisma.friendRequests.delete({
      where: {
        id
      }
    });
    console.log(result);
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
}
