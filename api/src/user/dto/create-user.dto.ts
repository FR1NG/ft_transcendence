import { IsEmail, IsInt, IsString, Min, Max, Length } from 'class-validator';
import { Transform, TransformFnParams } from "class-transformer"

export class CreateUserDto {
  @IsInt()
  intra_id: number

  @IsString()
  @Length(3, 20)
  @Transform(({value}: TransformFnParams) => value.trim())
  username: string;

  @IsEmail()
  @Transform(({value}: TransformFnParams) => value.trim())
  email: string

  @IsString()
  avatar: string
}
