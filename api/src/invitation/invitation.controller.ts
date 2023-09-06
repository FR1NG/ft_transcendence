import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt.guard';
import { InvitationService } from './invitation.service';
import { User } from 'src/common/decorators';
import { AuthenticatedUser } from 'src/types';

@Controller('invitation')
export class InvitationController {

  constructor(private invitationService: InvitationService) {}

  @Get(':id')
  @UseGuards(AuthGuard)
  async getInvitation(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.invitationService.getInvitation(user, id);
  }
}
