import { IsString, Length } from "class-validator";

export class otpDto {
  @IsString()
  @Length(6)
  code: string
}
