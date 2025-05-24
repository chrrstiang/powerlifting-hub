import { IsString, IsNotEmpty, IsEnum, IsEmail } from 'class-validator'
import { UserRole } from '../entities/user.abstract';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  password: string;

  @IsEnum(UserRole)
  role: UserRole;
}
