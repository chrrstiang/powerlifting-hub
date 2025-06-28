import { PartialType } from '@nestjs/mapped-types';
import { CreateProgramDto } from 'src/program/dto/create-program.dto';
import { Block } from "src/block/entities/block.entity";
import { DateRange } from "src/common/types/date-range.class";
import { Coach } from "src/users/entities/user.coach";
import { IsString, IsOptional} from 'class-validator'
import { Type } from 'class-transformer'

export class UpdateProgramDto extends PartialType(CreateProgramDto) {
    
    @IsOptional()
    @IsString()
    public name?: string;
    
    @IsOptional()
    @Type(() => Block)
    public trainingBlocks?: Block[];
    
    @IsOptional()
    @Type(() => Coach)
    public created_by?: Coach;
    
    @IsOptional()
    @Type(() => DateRange)
    public timeSpan?: DateRange;
}
