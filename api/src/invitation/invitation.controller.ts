import { Controller, Get, Post, Delete, Param, UseGuards, Body } from '@nestjs/common';
import { AuthGuard } from 'src/auth/jwt.guard';
import { InvitationService } from './invitation.service';
import { User } from 'src/common/decorators';
import { AuthenticatedUser } from 'src/types';
import { CreateInvitationDto } from './dto/invitation.dto';
import { BlockGuard } from 'src/common/guards/block/block.guard';

@Controller('invitation')
export class InvitationController {

  constructor(private invitationService: InvitationService) {}

  @Post()
  @UseGuards(BlockGuard)
  @UseGuards(AuthGuard)
  async createInvitation(@User() user: AuthenticatedUser, @Body() data: CreateInvitationDto) {
    return await this.invitationService.createInvitation(user, data) ;
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async getInvitation(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.invitationService.getInvitation(user, id);
  }

  @Post('/accept/:id')
  @UseGuards(AuthGuard)
  async acceptInvitation(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.invitationService.acceptInvitation(user, id);
  }

  @Post('/decline/:id')
  @UseGuards(AuthGuard)
  async declineInvitation(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.invitationService.declineInvitation(user, id);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async cancelInviataion(@User() user: AuthenticatedUser, @Param('id') id: string) {
    return await this.invitationService.deleteInvitation(user.sub, id);
  }

}
