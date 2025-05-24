import { Block } from "src/block/entities/block.entity";
import { DateRange } from "src/common/types/date-range.class";
import { Coach } from "src/users/entities/user.coach";
import { IsInt, IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProgramDto {
    
    @IsString()
    public name: string;
    
    @Type(() => Block)
    public trainingBlocks: Block[];
    
    @Type(() => Coach)
    public created_by: Coach;
    
    @Type(() => DateRange)
    public timeSpan: DateRange;
}
