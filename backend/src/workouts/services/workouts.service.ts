import { Injectable } from '@nestjs/common';
import { CreateWorkoutDto } from '../dto/create-workout.dto';
import { UpdateWorkoutDto } from '../dto/update-workout.dto';
import { Workout } from '../entities/workout.entity';

@Injectable()
export class WorkoutsService {
  private workouts: Workout[] = [];
  private nextId = 1;

  // this is the stuff that happens when a Workout is created
  create(createWorkoutDto: CreateWorkoutDto) {
    const newWorkout: Workout = {
      id: this.nextId++, ...createWorkoutDto,
      blockId: 0,
      exercises: []
    }
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  // this is how to fetch ALL workouts for an Athlete
  findAll() {
    return this.workouts;
  }

  // fetches a specific workout for an Athlete
  findOne(id: number) {
    return this.workouts.find(w => w.id == id);
  }

  // updates a workout of an Athlete
  update(id: number, updateWorkoutDto: UpdateWorkoutDto) {
    const workout = this.findOne(id);
    if (!workout) return null;
    Object.assign(workout, updateWorkoutDto);
    return workout;
  }

  // removes a workout of an Athlete
  remove(id: number) {
    return this.workouts.filter(w => w.id !== id);
  }
}
