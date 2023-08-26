import { SetMetadata } from '@nestjs/common';

export const CheckRoomAbility = (...args: string[]) => SetMetadata('check-room-ability', args);
