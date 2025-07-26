import { Block } from "src/block/entities/block.entity";
import { IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProgramDto {
    
    @IsString()
    public name: string;
    
    @Type(() => Block)
    public trainingBlocks: Block[];
}
