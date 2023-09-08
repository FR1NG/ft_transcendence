import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';

@Injectable()
export class NotificationService {

  constructor(private prisma: PrismaService, private eventEmitter: EventEmitter2) {}

  async createNotification(userId: string, content: string, link: string): Promise<any> {
    const notification = await this.prisma.notifications.create({
      data: {
        userId,
        content,
        link
      }
    });
    
    
    // sending notification on the socket
    this.eventEmitter.emit('notification.create', {
      userId,
      data: {
        id: notification.id,
        content: content,
        link: link,
      }
    });
    return notification;
  }

  async getUserNotifications(id: string): Promise<any> {
    const notifications = await this.prisma.notifications.findMany({
      where: {
        userId: id
      },
      select: {
        id: true,
        content: true,
        link: true,
        seen: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    return notifications;
  }

  async markRead(user: AuthenticatedUser, ids: Array<number>) {
    const updated: Array<number> = [];
    ids.forEach(async (el: number) => {
      const result = await this.prisma.notifications.update({
        where: {
          id: el,
          user: {
          id : user.sub
          }
        },
        data: {
          seen: true
        },
        select: {
          id: true
        }
      });
      if(result)
        updated.push(result.id);
    });
    return updated;
  }
}
