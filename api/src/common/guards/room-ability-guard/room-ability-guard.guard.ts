import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Request } from 'express';
import { PrismaService } from 'src/prisma.service';
import { AuthenticatedUser } from 'src/types';
import { Actions, CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
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
    if(!user)
      throw new UnauthorizedException();
    let id : string;
    const bodyMethods = [
      'POST',
      'DELETE',
    ];
    const paramsMethods = [
      'GET',
      'PATCH'
    ]
    if(bodyMethods.includes(request.method))
      id = request.body.id || request.body.roomId;
    if(paramsMethods.includes(request.method))
      id = request.params.id || request.params.roomId;
    if(!id )
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
    if(room.baned)
      throw new ForbiddenException()
    const ability = this.casl.createForRoom(room);
    abilities.forEach((action: Actions) => {
      try {
        ForbiddenError.from(ability).throwUnlessCan(action, 'room');
      } catch (error) {
        throw new ForbiddenException(error);
      }
    });
    
    return true;
  }
}
