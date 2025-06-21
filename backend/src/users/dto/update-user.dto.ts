import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsEnum, IsEmail, IsOptional, MinLength } from 'class-validator'
import { UserRole } from '../entities/user.abstract';
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    @IsUnique('users', 'email', { message: "Email is already taken"})
    email?: string;

    @IsOptional()
    @IsString()
    @IsUnique('users', 'email', { message: "Username is already taken"})
    username?: string;

    @IsOptional()
    @IsEnum(UserRole)
    role?: UserRole;

}
