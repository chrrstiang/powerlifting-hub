import { Ranges } from "./range.interface";

export class LoadRange implements Ranges{

    constructor(
        public min: number, 
        public max: number) {
    if (min > max) throw new ErrorEvent("Min cannot be greater than max.")

    }
}