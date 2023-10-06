import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class BlockGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const { user } =  request;
    if(!user)
      throw new UnauthorizedException();
    const id = request.body.userId;
    const block = await this.prisma.block.findFirst({
      where: {
        OR: [
          {blockedId: user.sub, blockerId: id},
          {blockedId: id, blockerId: user.sub},
        ]
      }
    });
    if(block) {
      throw new ForbiddenException();
    }
    return true;
  }
}
