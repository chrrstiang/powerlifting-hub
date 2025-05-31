import { IsEmail, IsString, MinLength } from "class-validator";
import { IsUnique } from "src/common/decorators/unique.decorator";

export class CreateAuthDto {

    @IsEmail()
    @IsUnique('users', 'email', {message: "Email is already being used"})
    email: string;

    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters long"})
    password: string;
}
