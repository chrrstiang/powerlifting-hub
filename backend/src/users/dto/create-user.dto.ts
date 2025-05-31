import { IsString, IsNotEmpty, IsEnum, IsEmail, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.abstract';
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique('users', 'email', { message: "Email is already taken"})
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique('users', 'username', { message: "Username is already taken"})
  username: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(6, { message: "Password must be at least 6 characters long"})
  password: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
