import { Block } from "src/block/entities/block.entity";
import { DateRange } from "src/common/types/date-range.class";
import { Coach } from "src/users/entities/user.coach";

export class Program {

    constructor(
    public id: number,
    public name: string,
    public trainingBlocks: Block[],
    public created_by: Coach,
    public timeSpan: DateRange
    ) {}
}
