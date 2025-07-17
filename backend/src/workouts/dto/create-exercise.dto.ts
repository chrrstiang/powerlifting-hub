import { IsString, IsInt, ValidateNested, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { LoadRange } from 'src/common/types/load-range.class';
import { IsUnique } from 'src/common/validation/decorators/unique.decorator';

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

  @ValidateNested()
  @Type(() => LoadRange) // needed to transform nested object
  loadRange: LoadRange;

  @IsInt()
  actualLoad: number;
}
