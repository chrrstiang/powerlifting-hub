import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { IsUnique } from '../../common/decorators/unique.decorator';

export class CreateAuthDto {

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters long"})
    password: string;
}
