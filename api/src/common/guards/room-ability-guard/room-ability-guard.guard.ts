import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ForbiddenError } from '@casl/ability';

@Injectable()
export class RoomAbilityGuardGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
    private casl: CaslAbilityFactory
  ) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const abilities = this.reflector.get('check-room-ability', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const user: AuthenticatedUser = request.user;
    const sub = user.sub;
    if(!user)
      throw new UnauthorizedException();
    const { id } = request.params;
    if(!id)
      throw new BadRequestException('room id must be Specified');
    const room = await this.prisma.usersRooms.findFirst({
      where: {
        user: {
          id: user.sub
        },
        room: {
          id
        }
      },
    });
    if(!room)
      throw new NotFoundException('room does not exist or you are not a member of it');
    const ability = this.casl.createForRoom(room);
    abilities.forEach(element => {
      ability.can(element, 'room');
      try {
        ForbiddenError.from(ability).throwUnlessCan(element, 'room');
      } catch (error) {
        throw new ForbiddenException(error);
      }
    });
    
    return true;
  }
}
