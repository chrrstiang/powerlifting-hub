import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {

    @IsOptional()
    @IsString()
    email: string;

    @IsOptional()
    @IsString()
    password: string;
}
