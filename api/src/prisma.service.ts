import { HttpException, Injectable, OnModuleDestroy, OnModuleInit, UnauthorizedException } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { PrismaClient, Prisma } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy  {
  async onModuleInit() {
    await this.$connect();
    this.$use(this.SendMesageMiddleware);
  }

  async onModuleDestroy() {
      await this.$disconnect();
  }

  SendMesageMiddleware: Prisma.Middleware = async (params, next) => {
    if(params.model === 'Messages' && params.action === 'create') {
      const id = params.args.data.converstion?.connect?.id;
       const conversation = await this.conversations.findUnique({
        where: { 
          id
        },
        include: {
          usersConversation: {
            select: {
              userOne: {
                select: {
                  id: true
                }
              },
              userTwo:  {
                select: {
                  id: true
                }
              }

            }
          }
        }
      });

      const isBlocked = await this.block.findFirst({
        where: {
          OR: [
            {
              blockedId: conversation.usersConversation.userOne.id,
              blockerId: conversation.usersConversation.userTwo.id,
            },
            {
              blockerId: conversation.usersConversation.userOne.id,
              blockedId: conversation.usersConversation.userTwo.id,
            },
          ]
        }
      })

      if(isBlocked)
        throw new WsException('you cant send message to this user');
    }
    return next(params);
  }
}
