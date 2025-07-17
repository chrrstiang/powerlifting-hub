import { CreateUserDto } from "../create-user.dto";
import { IsOptional, IsString, IsUUID } from 'class-validator'; 

export class CreateAthleteDto extends CreateUserDto {

    @IsOptional()
    @IsString()
    weight_class?: string;

    @IsOptional()
    @IsString()
    division?: string;

    @IsOptional()
    @IsString()
    team?: string;
}