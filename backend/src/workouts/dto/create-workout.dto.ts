import { IsInt, IsDate } from 'class-validator';
import { Exercise } from '../entities/exercise.entity';

export class CreateWorkoutDto {
  @IsInt()
  blockId: number;

  @IsInt()
  athleteId: number;

  exercises: Exercise[];

  @IsDate()
  date: Date;
}
