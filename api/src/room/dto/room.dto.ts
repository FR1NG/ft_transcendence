import { PartialType } from "@nestjs/mapped-types"
import { IsEnum, IsNumber, IsString, IsStrongPassword, IsUUID, Length, Matches, Min, Validate, ValidateIf, ValidationArguments } from "class-validator"
enum Types {
  'PUBLIC',
  'PROTECTED',
  'PRIVATE',
}

export  class CreateRoomDto {

  @IsString()
  @Length(3, 50)
  name: string

  @IsEnum(Types)
  type: 'PRIVATE' | 'PROTECTED' | 'PUBLIC'

  @ValidateIf(o => o.type === 'PROTECTED')
  @IsStrongPassword()
  password: string
}

export class JoinRoomDto { 
  id: string
  password: string
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {
  oldPassword?: string
  @ValidateIf(o => o.oldPassword.length > 0)
  @IsStrongPassword()
  password: string
}

export class InviteUserDto  {
  @IsUUID()
  roomId: string

  @IsUUID()
  userId: string
}

const allowedTimeOuts = [
  5,
  10,
  15,
  30
]

export class MuteUserDto {
  @IsUUID()
  roomId: string

  @IsUUID()
  userId: string

  @IsNumber()
  @Validate((value: number) => allowedTimeOuts.includes(value))
  time: number
}
