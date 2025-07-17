import { IsString, IsInt, IsOptional, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { LoadRange } from 'src/common/types/load-range.class';
import { PartialType } from '@nestjs/mapped-types';
import { CreateExerciseDto } from './create-exercise.dto';
import { IsUnique } from 'src/common/validation/decorators/unique.decorator';

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
  @ValidateNested()
  @Type(() => LoadRange)
  loadRange?: LoadRange;

  @IsOptional()
  @IsInt()
  actualLoad?: number;
}
