import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Injectable } from "@nestjs/common";
import { SupabaseService } from "src/supabase/supabase.service";

/** This validator is responsible for checking that the given value exists, 
 * in the context of the given table and column. If true, the validator passes.
 * 
 */
@ValidatorConstraint({name: 'ValueExists', async: true})
@Injectable()
export class ValueExistsValidator implements ValidatorConstraintInterface {
    constructor(private readonly supabaseService: SupabaseService) {}

    async validate(
        value: any, validationArguments?: ValidationArguments): Promise<boolean> {
            
        if (!validationArguments?.constraints || validationArguments.constraints.length < 2) {
            console.error('Missing constraints for IsUniqueValidator');
            return false;
        }
        const [tableName, column] = validationArguments?.constraints;
        const supabase = this.supabaseService.getClient();

        const { data } = await (supabase as any)
        .from(tableName)
        .select('id')
        .eq(column, value)
        .maybeSingle() as any;

        if (data) {
            return true;
        }
        
        return !data;
    }
    defaultMessage?(validationArguments?: ValidationArguments): string {
        if (!validationArguments?.constraints || validationArguments.constraints.length < 2) {
            return `${validationArguments?.property} is not a valid value.`;
        }
        const [column] = validationArguments?.constraints
        return`${validationArguments?.property} is not a valid value for ${column}.`
    }
    
}
