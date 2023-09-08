import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MessagePaylod } from './dto/chat';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) { }
  async createDm(payload: MessagePaylod, auth: AuthenticatedUser) {

    const { sub: createorId } = auth;
    const { recieverId: engagerId, content } = payload;
    let message = {};

    let dmConversation: any = await this.getDmConversation(auth.sub, payload.recieverId);
    if (!dmConversation)
      message = await this.createDmConversation(createorId, engagerId, content);
    else {
      const { id: conversationId } = dmConversation;
      const { content } = payload;
      message = await this.createMessage(conversationId, createorId, content);
    }
    return message;
  }

  async createRoomMessage(user: AuthenticatedUser, payload: MessagePaylod) {
    const { content, recieverId } = payload;
    const room = await this.prisma.rooms.findUnique({
      where: {
        id: recieverId,
      },
      select: {
        name: true,
        id: true,
        users: {
          where: {
            userId: user.sub,
            baned: false
          },
        },
        conversation: {
          select: {
            id: true
          }
        }
      }
    });

    if (!room || room.users.length === 0)
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
            avatar: true
          }
        }
      }
    });
    if (!message)
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
        conversation: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                content: true,
                seen: true,
                sender: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            }
          }
        }
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
                content: true,
                seen: true,
                sender: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
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
        content: true,
        seen: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
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
            messages: {
              select: {
                id: true,
                content: true,
                sender: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            }
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
        isOnline: true
      }
    })

    if (!user)
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

    const messages = conversation?.conversation?.messages;
    // const filtredMessages = [];
    // conversation?.conversation?.messages?.forEach(message => {
    //   let type: string;
    //   const { id, content } = message
    //   if (message.senderId === authUser.sub)
    //     type = 'sent';
    //   else
    //     type = 'recieved';
    //   filtredMessages.push({
    //     id,
    //     content,
    //     type,
    //     loading: false
    //   })
    // })
    return {
      user,
      messages,
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
            baned: false,
            userId: user.sub
          }
        },
        conversation: {
          select: {
            id: true,
            messages: {
              select: {
                id: true,
                content: true,
                sender: {
                  select: {
                    id: true,
                    username: true,
                    avatar: true,
                  }
                }
              }
            },
          }
        }
      }
    })

    if (room.users.length === 0)
      throw new UnauthorizedException('you are not authorized to access this room');
    delete room['users'];
    return room;
  }


  async getUsers(user: AuthenticatedUser) {
    const { sub: id } = user;
    const conversations = await this.prisma.usersConversation.findMany({
      where: {
        OR: [{
          userOne: { id }
        },
        {
          userTwo: { id }
        }]
      },
      select: {
        userOne: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true
          }
        },
        userTwo: {
          select: {
            id: true,
            username: true,
            avatar: true,
            isOnline: true
          }
        },
        conversation: {
          select: {
            messages: {
              where: {
                seen: false,
                sender: {
                  NOT: [
                    {
                      id
                    }
                  ]
                }
                
              },
              select: {
                id: true 
              }
            }
          }
        }
      },
    });
    
     const users = [];
    conversations.forEach(el => {
      if (el.userOne.id !== id)
        users.push({ user: el.userOne, unseen: el.conversation.messages});
      else
        users.push({ user: el.userTwo, unseen: el.conversation.messages});
    });
    return users;
  }

  // mark the messages as read
  async markRead(user: AuthenticatedUser, id: string) {
    const conversation = await this.prisma.usersConversation.findFirst({
      where: {
        OR: [
          { userOneId: user.sub, userTwoId: id},
          { userTwoId: user.sub, userOneId: id}
        ]
      },
      select: {
        conversation: {
          select: {
            id: true
          }
        }
      }
    });

    if(!conversation)
      throw new NotFoundException('conversation not found');
    const result = await this.prisma.messages.updateMany({
      where: {
        converstion: {
          id:  conversation.conversation.id,
        },
        seen: false,
      },
      data: {
        seen: true
      }
    });
    if(result)
      return {message: 'messages read successfully'};
    throw new InternalServerErrorException();
  }

  //class:END
}
