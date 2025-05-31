import { Coach } from "src/users/entities/user.coach";
import { CreateUserDto } from "../create-user.dto";
import { Program } from "src/program/entities/program.entity";
import { Type } from 'class-transformer'
import { IsEnum, IsString } from 'class-validator' 
import { UserRole } from "src/users/entities/user.abstract";

export class CreateAthleteDto extends CreateUserDto {
    
    @IsEnum(UserRole)
    role: UserRole = UserRole.ATHLETE;

    @IsString()
    coachId: string;

    @IsString()
    programId: Program;
}