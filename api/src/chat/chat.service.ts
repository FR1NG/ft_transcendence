import { Injectable } from '@nestjs/common';
import { MessagePaylod } from './dto/chat';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }
  async createDm(payload: MessagePaylod, auth: AuthenticatedUser) {

    const  {  sub:  createorId } = auth;
    const  {  recieverId:  engagerId, content } = payload;

    let dmConversation: any = await this.getDmConversation(auth.sub, payload.recieverId);
    if(!dmConversation)
      dmConversation = await this.createDmConversation(createorId, engagerId, content);
    else {
      const { id: conversationId } = dmConversation;
      const { content } = payload;
      this.createMessage(conversationId, createorId, content);
    }
    return dmConversation;
  }

  private async getDmConversation(createorId: string, engagerId: string) {
    const conversation = await this.prisma.usersConversation.findFirst({
      where: {
        OR: [
          {
            userOneId: createorId,
            userTwoId: engagerId,
          },
          {
            userOneId: engagerId,
            userTwoId: createorId,
          }
        ]
      },
      select: {
        conversation: true
      }
    });
    return conversation?.conversation;
  }

  private async createDmConversation(createorId: string, engagerId: string, messageContent: string) {
    const conversation = await this.prisma.usersConversation.create({
      data: {
        userOne: {
          connect: {
            id: createorId
          }
        },
        userTwo: {
          connect: {
            id: engagerId
          }
        },
        conversation: {
          create: {
            messages: {
              create: [
                { 
                  content: messageContent,
                  sender: {
                    connect: {
                      id: createorId
                    }
                  }
                }
              ]
            }
          }
        }
      },
      select: {
        conversation: true,
      }
    });
    return conversation?.conversation;
  }

  // method to add a message to already existing conversation
  async createMessage(conversationId: string, senderId: string, content: string) {
    const message = await this.prisma.messages.create({
      data: {
        content: content,
        converstion: {
          connect: {
            id: conversationId
          },
        },
        sender: {
          connect: {
            id: senderId,
          }
        }
      },
    });
    return message;
  }


  // get conversation between the logged user and another user by id
  async getUsersConversation(authUser: AuthenticatedUser, userId: string) {

    const conversation = await this.prisma.usersConversation.findFirst({
      where: {
        OR: [
          {
            userOneId: userId,
            userTwoId: authUser.sub
          },
          {
            userOneId: authUser.sub,
            userTwoId: userId
          }
        ]
      },
      select: {
        conversation: {
          select: {
            messages: true
          }
        }
      }
    });
    const filtredMessages = [];
    conversation?.conversation?.messages?.forEach(message => {
      let type: string;
      const {id, senderId, content } = message
      if (message.senderId === authUser.sub)
        type = 'sent';
      else
        type = 'recieved';
      filtredMessages.push({
        id,
        content,
        type
      })
    })
    return filtredMessages;
  }


  //class:END
}
