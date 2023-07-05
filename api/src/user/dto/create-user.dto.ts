import { IsEmail, IsInt, IsString, Min, Max, Length } from 'class-validator';

export class CreateUserDto {
  @IsInt()
  intra_id: number

  @IsString()
  @Length(3, 20)
  username: string;

  @IsEmail()
  email: string

  @IsString()
  avatar: string
}
