import { Ranges } from "./range.interface";

export class DateRange implements Ranges {

    constructor(
        public startDate: Date,
        public endDate: Date
    ) {
        if (startDate.valueOf() > endDate.valueOf()) throw new Error("Start date cannot be after end date.")
    }
    
}