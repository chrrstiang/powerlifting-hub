import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator' 
import { UpdateUserDto } from "../update-user.dto";

export class UpdateAthleteDto extends UpdateUserDto {

    @IsOptional()
    @IsString()
    weightClass: string;

    @IsOptional()
    @IsString()
    division: string;

    @IsOptional()
    @IsString()
    team: string;

    @IsOptional()
    @IsUUID()
    coachId: string;
}