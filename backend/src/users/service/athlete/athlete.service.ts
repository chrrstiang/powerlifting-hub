import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AuthError, PostgrestError, SupabaseClient } from '@supabase/supabase-js';
import { MissingIdException } from 'src/common/exceptions/missing-id';
import { SupabaseService } from 'src/supabase/supabase.service';
import { CreateAthleteDto } from 'src/users/dto/athlete/create-athlete.dto';
import { UpdateAthleteDto } from 'src/users/dto/athlete/update-athlete.dto';
;

/** The AthleteService class contains business logic for the API endpoints of the AthleteController.
 *  This contains operations such as inserting/updating athlete profiles to Supabase,
 * retrieveing profile details of an Athlete, and...
 * 
 */
@Injectable()
export class AthleteService {

  supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    this.supabase = this.supabaseService.getClient()
  }
  
  /** Inserts a row into the 'athletes' table with the data contained in the
   * DTO. Additionally, the name and username of the DTO are stored in the 'users' table.
   * 
   * @param dto The DTO containing the athlete profile data.
   */
  async createProfile(dto: CreateAthleteDto) {
    const user = await this.getAuthUser();
  
    const user_id = user.user.id
  
    // Seperate data for 'athletes' and 'users' table
    const { name, username, ...athleteFields } = dto;
  
    // Insert into 'users'
    const userData = { name, username };
    await this.addToTable(userData, 'users');
  
    // Insert into 'athletes'
    const athleteData = { ...athleteFields, user_id: user_id };
    await this.addToTable(athleteData, 'athletes');
  }

  /** Queries the database for the row with the same user_id as the current authenticated
   * user's id, fetching columns that make up the public profile of the athlete.
   * 
   * @param columns An array containing the columns of the profile to return.
   * @returns An object containing the values of the columns requested.
   */
  async retrieveProfileDetails(columns?: string[]) {
    let selectQuery: string;

    const user = await this.getAuthUser();
    const id = user.user.id;
    
    if (columns && columns.length > 0) {
      // Separate fields by table
      const athleteFields = columns.filter(f => 
        ['weight_class', 'division', 'team', 'id'].includes(f)
      );
      const userFields = columns.filter(f => 
        ['name', 'username', 'email'].includes(f)
      );
      
      // Build the select query
      const athletePart = athleteFields.length > 0 ? athleteFields.join(',') : '';
      const userPart = userFields.length > 0 ? `users(${userFields.join(',')})` : '';
      
      // Combine parts
      selectQuery = [athletePart, userPart].filter(Boolean).join(',');
    } else {
      // Default: select all relevant fields
      selectQuery = 'weight_class,division,users(name,username,email)';
    }
  
    const { data, error } = await this.supabase
      .from('athletes')
      .select(selectQuery)
      .eq('user_id', id)
      .single();
  
    if (error) {
      this.handleSupabaseError(error, 'select');
    };

    return data;
  }

  /** Updates the column of the user in the 'athletes' table with the
   * value contained in the DTO. This method assumes that only ONE column
   * was updated, therefore the DTO contains one field.
   * 
   * @param updateUserDto The DTO containing the updated column value.
   */
  async updateProfile(dto: UpdateAthleteDto) {
    // ensure only one new value is in DTO.
    const fieldCount = Object.values(dto).filter(value => value !== undefined).length;
  
    if (fieldCount !== 1) {
    throw new BadRequestException('Exactly one field must be provided for update.');
    }

    const user = await this.getAuthUser();
    let table: string;
    let cond: string;

    if (dto.name || dto.username) {
      table = 'users';
      cond = 'id';
    } else {
      table = 'athletes';
      cond = 'user_id';
    }

    const { error } = await this.supabase
    .from(table)
    .update(dto)
    .eq(cond, user.user.id);

    if (error) {
      this.handleSupabaseError(error, 'update');
    }
  }

  // adds the object containing specific fields to the designated table.
  private async addToTable(data: any, table: string) {
    const { error } = await this.supabase.from(table).insert(data);

    if (error) {
     this.handleSupabaseError(error, 'insert')
    }
  }

  // given an error returned by Supabase, displays an appropriate message 
  private handleSupabaseAuthError(error: AuthError, operation: string) {
    switch (error.code) {
      case 'invalid_credentials':
      case 'user_not_found':
      case 'session_not_found':
      case 'jwt_expired':
        throw new UnauthorizedException('Authentication failed. Please log in again.');
      default:
        throw new InternalServerErrorException(`An unexpected error occured for ${operation}:
      ${error.code} - ${error.message}`);
      }
    }

    // given an error returned by Supabase, displays an appropriate message 
  private handleSupabaseError(error: PostgrestError, operation: string) {
    throw new BadRequestException(`An unexpected error occured for ${operation}:
      ${error.code} - ${error.message}`);
  }

  // returns the authenticated user and ensures its non-null.
  private async getAuthUser() {
    const { data, error } = await this.supabase.auth.getUser();

    if (error) {
      this.handleSupabaseAuthError(error, 'getUser');
    }

    if (!data.user?.id) {
      throw new MissingIdException();
    }

    return data;
  }
}
