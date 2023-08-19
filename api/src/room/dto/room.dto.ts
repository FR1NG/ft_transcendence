import { IsEnum, IsString, Length, Min, ValidateIf } from "class-validator"
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
  @IsString()
  @Length(8, 50)
  password: string
}

export class JoinRoomDto { 

  id: string

  password: string
}
