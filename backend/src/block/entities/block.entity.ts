import { DateRange } from "src/common/types/date-range.class";
import { Week } from "./week.entity";

export class Block {
    constructor(
        public id: number,
        public name: string,
        public programId: number,
        public weeks: Week[],
        public timeSpan: DateRange
        ) {}
}
