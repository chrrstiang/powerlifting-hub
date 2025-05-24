import { IsString, IsInt, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LoadRange } from 'src/common/types/load-range.class';
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
  @IsInt()
  intensity?: number;

  @IsOptional()
  @IsInt()
  actualIntensity?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => LoadRange)
  loadRange?: LoadRange;

  @IsOptional()
  @IsInt()
  actualLoad?: number;
}
