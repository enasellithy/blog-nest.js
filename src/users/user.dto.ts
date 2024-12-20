import { IsEmail, IsString, MinLength, MaxLength, IsOptional } from "class-validator";

export class LoginDTO {
  @IsEmail()
  @IsString()
  @MinLength(4)
  email: string;

  @IsString()
  @MinLength(4)
  password: string;
}

export class RegisterDTO extends LoginDTO {
  @IsString()
  @MinLength(4)
  @MaxLength(20)
  username: string;
}

export class LogoutDTO {
  @IsOptional()
  @IsString()
  refreshToken?: string;
}