import { IsEmail, IsInt, IsString } from "class-validator"

export class CreateUserDto {
  @IsInt()
  intra_id: number

  @IsString()
  username: string

  @IsEmail()
  email: string

  @IsString()
  avatar: string
}
