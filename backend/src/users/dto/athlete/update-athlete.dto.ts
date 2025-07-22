import { IsOptional, IsString } from 'class-validator' 
import { CreateAthleteDto } from './create-athlete.dto';
import { PartialType } from '@nestjs/mapped-types';
import { ValueExists } from 'src/common/validation/decorators/validate-federation';

/** Data-transfer object designed for updating an athlete record in Supabase.
 * Contains all optional information that the user can choose to submit, with 
 * appropriate validation decorators. 
 * 
 */
export class UpdateAthleteDto extends PartialType(CreateAthleteDto) {

    @IsOptional()
    @IsString()
    @ValueExists('federations', 'code')
    federation?: string;

    @IsOptional()
    @IsString()
    @ValueExists('weight_classes', 'class_name')
    weight_class?: string;

    @IsOptional()
    @IsString()
    @ValueExists('divisions', 'division_name')
    division?: string;
}