import { Athlete } from "src/users/entities/user.athlete";
import { CreateUserDto } from "../create-user.dto";
import { Type } from 'class-transformer' 
import { UserRole } from "src/users/entities/user.abstract";
import { IsEnum } from 'class-validator'

export class CreateCoachDto extends CreateUserDto {
    
    @IsEnum(UserRole)
    role: UserRole = UserRole.COACH;

    @Type(() => Athlete)
    athletes: Athlete[];
}