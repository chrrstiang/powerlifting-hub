import { IsString, IsNotEmpty } from 'class-validator'
import { IsUnique } from 'src/common/validation/decorators/unique.decorator';

export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique('users', 'username', { message: "Username is already taken"})
  username: string;
}
