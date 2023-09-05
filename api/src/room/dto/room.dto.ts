import { PartialType } from "@nestjs/mapped-types"
import { IsEnum, IsString, IsStrongPassword, IsUUID, Length, Matches, Min, ValidateIf, ValidationArguments } from "class-validator"
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
