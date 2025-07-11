import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsString, IsOptional } from 'class-validator'
import { IsUnique } from 'src/common/decorators/unique.decorator';

export class UpdateUserDto extends PartialType(CreateUserDto) {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    @IsUnique('users', 'username', { message: "Username is already taken"})
    username?: string;
}
