import { PartialType } from '@nestjs/mapped-types';
import { DateRange } from "src/common/types/date-range.class";
import { Week } from "../entities/week.entity";
import { IsString, IsInt, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'
import { CreateBlockDto } from './create-block.dto';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {
    
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsInt()
    programId?: number;

    @IsOptional()
    @Type(() => Week)
    weeks?: Week[];

    @IsOptional()
    @Type(() => DateRange)
    timeSpan?: DateRange;
}