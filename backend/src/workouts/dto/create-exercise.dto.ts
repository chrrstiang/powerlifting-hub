import { IsString, IsInt, ValidateNested, IsNumber } from 'class-validator';

export class CreateExerciseDto {
  @IsString()
  name: string;

  @IsInt()
  workoutId: number;

  @IsInt()
  sets: number;

  @IsInt()
  reps: number;

  @IsNumber()
  intensity: number;

  @IsNumber()
  actualIntensity: number;

  @IsInt()
  actualLoad: number;
}
