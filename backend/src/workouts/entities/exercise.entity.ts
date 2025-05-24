import { LoadRange } from "src/common/types/load-range.class";

export class Exercise {

    constructor(id: number,
        public name: string,
        public workoutId: number,
        public sets: number,
        public reps: number,
        public intensity: number,
        public actualIntensity: number,
        public loadRange: LoadRange,
        public actualLoad: number) {
        }
}
