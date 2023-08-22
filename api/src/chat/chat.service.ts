import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MessagePaylod } from './dto/chat';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }
  async createDm(payload: MessagePaylod, auth: AuthenticatedUser) {

    const  {  sub:  createorId } = auth;
    const  {  recieverId:  engagerId, content } = payload;
    let message = {};

    let dmConversation: any = await this.getDmConversation(auth.sub, payload.recieverId);
    if(!dmConversation)
      message = await this.createDmConversation(createorId, engagerId, content);
    else {
      const { id: conversationId } = dmConversation;
      const { content } = payload;
      message = await this.createMessage(conversationId, createorId, content);
    }
    return message;
  }

  async createRoomMessage(user: AuthenticatedUser, payload: MessagePaylod) {
    const { content, recieverId} = payload;
    const room = await this.prisma.rooms.findUnique({
      where: {
        id: recieverId, 
      },
      select: {
        name: true,
        id: true,
        users: {
          where: {
            userId: user.sub
          },
        },
        conversation: {
          select: {
            id: true
          }
        }
      }
    });
    
    if(!room || room.users.length === 0)
      throw new WsException('you are not autorized to send message to this room');
    const message = await this.prisma.messages.create({
      data: {
        content,
        sender: {
          connect: {
            id: user.sub
          }
        },
        converstion: {
          connect: room.conversation
        },
      },
      select: {
        id: true,
        content: true,
        sender: {
          select: {
            id: true,
            username: true,
          }
        }
      }
    });
    if(!message)
      throw new WsException('failed to create message');
    const { id, name } = room;
    message['room'] = { id, name };
    return message;
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
              create: {
                content: messageContent,
                sender: {
                  connect: {
                    id: createorId
                  }
                }
              }
              
            }
          },
        }
      },
      include: {
        conversation: {
          select: {
            messages: {
              select: {
                id: true,
                senderId: true,
                content: true
              }
            }
          }
        },
      }
    });
    return conversation?.conversation?.messages[0];
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
      select: {
        id: true,
        senderId: true,
        content: true,
      }
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


    const user = await this.prisma.users.findUnique({
      where: {
        id: userId
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        isOnline:  true
      }
    })

    if(!user)
      throw new NotFoundException()

    // getting if one of the users block the other
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          {
            blockerId: userId,
            blockedId: authUser.sub
          },
          {
            blockedId: userId,
            blockerId: authUser.sub
          }
        ]
      }
    });

    user['block'] = block ? true : false;

    const filtredMessages = [];
    conversation?.conversation?.messages?.forEach(message => {
      let type: string;
      const {id, content } = message
      if (message.senderId === authUser.sub)
        type = 'sent';
      else
        type = 'recieved';
      filtredMessages.push({
        id,
        content,
        type,
        loading: false
      })
    })
    return {
      user,
      messages: filtredMessages
    };
  }

  async getRoomConversation(user: AuthenticatedUser, roomId) {
    const room = await this.prisma.rooms.findUnique({
      where: {
        id: roomId
      },
      select: {
        id: true,
        name: true,
        type: true,
        users: {
          where: {
            userId : user.sub
          }
        },
        conversation: {
          select: {
            id: true,
            messages: true,
          }
        }
      }
    })
    
    if(room.users.length === 0)
      throw new UnauthorizedException('you are not in this room');
    delete room['users'];
    return room;
  }


  //class:END
}
