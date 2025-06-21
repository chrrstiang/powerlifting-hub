import { IsString, IsNotEmpty, IsEnum, IsEmail, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.abstract';
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class CreateUserDto {

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique('users', 'username', { message: "Username is already taken"})
  username: string;

  @IsNotEmpty()
  @IsEmail()
  @IsUnique('users', 'email', { message: "Email is already taken"})
  email: string;

  @IsEnum(UserRole)
  @IsNotEmpty()
  role: UserRole;
}
