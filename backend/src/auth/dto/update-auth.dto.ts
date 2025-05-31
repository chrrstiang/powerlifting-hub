import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @IsOptional()
    @IsEmail()
    @IsUnique('users', 'email', {message: "Email is already being used"})
    email: string;

    @IsOptional()
    @IsString()
    @MinLength(6, {message: "Password must be at least 6 characters long"})
    password: string;
}
