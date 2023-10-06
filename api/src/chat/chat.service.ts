import { BadRequestException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { MessagePaylod } from './dto/chat';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { WsException } from '@nestjs/websockets';
import { FriendService } from 'src/friend/friend.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService, private friendService: FriendService) { }
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
              take: 50,
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
        created_at: true,
        sender: {
          select: {
            id: true,
            username: true,
            avatar: true
          }
        }
      }
    });

    await this.prisma.conversations.update({
      where: {
        id: conversationId
      },
      data: {
        updated_at: new Date()
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
            id: true,
            messages: {
              take: 50,
              orderBy: {
                created_at: 'desc'
              },
              select: {
                id: true,
                content: true,
                created_at: true,
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

    let messagesCount = 0;
    if(conversation?.conversation) {
       messagesCount = await this.prisma.messages.count({
        where: {
          conversationId: conversation.conversation.id
        }
      });
    }

    user['block'] = block ? true : false;

    let messages = [];
    if(conversation?.conversation)
      messages = conversation?.conversation?.messages?.reverse();
    return {
      user,
      messages,
      messagesCount,
      conversationId: conversation?.conversation?.id
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
              orderBy: {
                created_at: 'desc'
              },
              take: 50,
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
    });
    if(!room)
      throw new NotFoundException();
    if (room.users.length === 0)
      throw new ForbiddenException('you are not authorized to access this room');

    room.conversation.messages = room.conversation?.messages?.reverse();
    const count = await this.prisma.messages.count({
      where: {
        conversationId: room.conversation.id
      }
    })
    delete room['users'];
    room['messagesCount'] = count;
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
        },
      },
      orderBy: {
        conversation: {
          updated_at: 'desc'
        }
      },
    });
    
     const users = [];
    const blocked = await this.friendService.getBlocked(user);
    conversations.forEach(el => {
      const otherId = el.userOne.id !== user.sub ? el.userOne.id : el.userTwo.id; 
      if(!blocked.includes(otherId)) {
        if (el.userOne.id !== id)
          users.push({ user: el.userOne, unseen: el.conversation.messages});
        else
          users.push({ user: el.userTwo, unseen: el.conversation.messages});
      }
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
    throw new BadRequestException();
  }

  async getUnreadedMessagesCount(user: AuthenticatedUser) {
    const unreaded = await this.prisma.usersConversation.findFirst({
      where: {
        OR:[
          {userOneId: user.sub},
          {userTwoId: user.sub},
        ]
      },
      select: {
        conversation: {
          select: {
            messages: {
              where: {
                NOT: [
                  {senderId: user.sub}
                ],
                seen: false
              },
              select: {
                id: true,
              }
            }
          }
        }
      }
    });
    return unreaded?.conversation?.messages?.length || 0;
  }


  // load more messages
  async loadMore(user: AuthenticatedUser, id: string, skip: number, type: 'dm' | 'room') {
    if (type === 'dm') {
      const allowed = await this.prisma.usersConversation.findFirst({
        where: {
          OR: [
            {userOneId: user.sub},
            {userTwoId: user.sub}
          ],
          conversationId: id
        },
      });
      if(!allowed)
        throw new ForbiddenException()
    } else if(type === 'room') {
      // TODO: load room conversation
      const allowed = await this.prisma.usersRooms.findFirst({
        where: {
          userId: user.sub,
          room: {
            conversationId: id
          }
        },
      });
      if(!allowed)
        throw new ForbiddenException();
    } else {
      throw new ForbiddenException();
    }
      const messages = await this.prisma.messages.findMany({
        orderBy: {
        created_at: 'desc'
        },
        skip: parseInt(skip.toString()),
        take: 50,
        where: {
          conversationId: id,
        },
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
      })
      return messages.reverse();
  }


  //class:END
}
