import { PartialType } from '@nestjs/mapped-types';
import { CreateWorkoutDto } from './create-workout.dto';
import { IsInt, IsDate, IsOptional } from 'class-validator';
import { Exercise } from '../entities/exercise.entity';

export class UpdateWorkoutDto extends PartialType(CreateWorkoutDto) {
  @IsOptional()
  @IsInt()
  blockId?: number;

  @IsOptional()
  @IsInt()
  athleteId?: number;

  @IsOptional()
  exercises?: Exercise[];

  @IsOptional()
  @IsDate()
  date?: Date;
}
