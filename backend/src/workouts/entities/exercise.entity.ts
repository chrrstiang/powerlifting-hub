export class Exercise {

    constructor(id: number,
        public name: string,
        public workoutId: number,
        public sets: number,
        public reps: number,
        public intensity: number,
        public actualIntensity: number,
        public actualLoad: number) {
        }
}
