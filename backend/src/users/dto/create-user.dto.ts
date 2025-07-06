import { IsString, IsNotEmpty, IsEnum, IsEmail, MinLength } from 'class-validator'
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique('users', 'username', { message: "Username is already taken"})
  username: string;
}
