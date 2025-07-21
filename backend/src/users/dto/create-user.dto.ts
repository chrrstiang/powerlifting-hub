import { IsString, IsNotEmpty, IsEnum, IsDateString } from 'class-validator'
import { IsUnique } from 'src/common/validation/decorators/unique.decorator';

export enum Gender {
  MALE = "Male", FEMALE = "Female", GENDER_FLUID = "Gender-fluid"
}

/** Contains all requierd fields when a user is completing their profile.
 * 
 */
export class CreateUserDto {

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsUnique('users', 'username')
  username: string;

  @IsNotEmpty()
  @IsEnum(Gender)
  gender: Gender;

  @IsNotEmpty()
  @IsDateString()
  date_of_birth: string;
}
