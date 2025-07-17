import { Block } from "src/block/entities/block.entity";
import { Coach } from "src/users/entities/user.coach";
import { IsString } from 'class-validator'
import { Type } from 'class-transformer'

export class CreateProgramDto {
    
    @IsString()
    public name: string;
    
    @Type(() => Block)
    public trainingBlocks: Block[];
    
    @Type(() => Coach)
    public created_by: Coach;
}
