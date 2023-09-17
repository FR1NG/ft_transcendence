import { InvitationType } from "@prisma/client";
import { IsUUID } from "class-validator";

export class CreateInvitationDto {
  @IsUUID()
  userId: string;

  type: InvitationType
}
