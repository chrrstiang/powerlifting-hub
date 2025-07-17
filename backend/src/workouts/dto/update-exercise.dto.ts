import { IsString, IsInt, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';

export class UpdateExerciseDto extends PartialType(CreateExerciseDto){
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  workoutId?: number;

  @IsOptional()
  @IsInt()
  sets?: number;

  @IsOptional()
  @IsInt()
  reps?: number;

  @IsOptional()
  @IsNumber()
  intensity?: number;

  @IsOptional()
  @IsNumber()
  actualIntensity?: number;

  @IsOptional()
  @IsInt()
  actualLoad?: number;
}
