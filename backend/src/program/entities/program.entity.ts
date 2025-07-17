import { Block } from "src/block/entities/block.entity";
import { Coach } from "src/users/entities/user.coach";

export class Program {

    constructor(
    public id: number,
    public name: string,
    public trainingBlocks: Block[],
    public created_by: Coach,
    ) {}
}
