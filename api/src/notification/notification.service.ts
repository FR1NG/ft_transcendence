import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class NotificationService {

  constructor(private prisma: PrismaService) {}

  async createNotification(userId: string, content: string, link: string): Promise<any> {
    const notification = await this.prisma.notifications.create({
      data: {
        userId,
        content,
        link
      }
    })
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
        link: true
      }
    });
    return notifications;
  }
}
