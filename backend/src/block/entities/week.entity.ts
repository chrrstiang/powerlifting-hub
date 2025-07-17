import { Workout } from "src/workouts/entities/workout.entity";

export class Week {
    constructor(
    public id: number,
    public name: string,
    public workouts: Workout[],
    ) {}
}