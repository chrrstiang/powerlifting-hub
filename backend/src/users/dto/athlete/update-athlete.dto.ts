import { IsOptional, IsString, IsUUID } from 'class-validator' 
import { UpdateUserDto } from "../update-user.dto";
import { CreateAthleteDto } from './create-athlete.dto';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateAthleteDto extends PartialType(CreateAthleteDto) {

    @IsOptional()
    @IsString()
    weightClass?: string;

    @IsOptional()
    @IsString()
    division?: string;

    @IsOptional()
    @IsString()
    team?: string;
}