import { IsString, IsInt, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { LoadRange } from 'src/common/types/load-range.class';

export class CreateExerciseDto {
    
  @IsString()
  name: string;

  @IsInt()
  workoutId: number;

  @IsInt()
  sets: number;

  @IsInt()
  reps: number;

  @IsInt()
  intensity: number;

  @IsInt()
  actualIntensity: number;

  @ValidateNested()
  @Type(() => LoadRange) // needed to transform nested object
  loadRange: LoadRange;

  @IsInt()
  actualLoad: number;
}
