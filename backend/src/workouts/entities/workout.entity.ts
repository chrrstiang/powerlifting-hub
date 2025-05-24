import { Exercise } from "./exercise.entity";

export class Workout {
    constructor(
    public id: number,
    public blockId: number,
    public athleteId: number,
    public exercises: Exercise[],
    public date: Date) {}
}
