import { Week } from "../entities/week.entity";
import { IsString, IsInt } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateBlockDto {
    
    @IsString()
    name: string;

    @IsInt()
    programId: number;

    @Type(() => Week)
    weeks: Week[];
}
