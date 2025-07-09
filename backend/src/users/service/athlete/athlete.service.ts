import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';import { SupabaseClient } from '@supabase/supabase-js';
import { CreateAthleteDto, CreateAthleteRecord } from 'src/users/dto/athlete/create-athlete.dto';
;

@Injectable()
export class AthleteService {
  
  /** Inserts a row into the 'athletes' table with the data contained in the
   * DTO. Additionally, the name and username of the DTO are stored in the 'users' table.
   * 
   * @param dto The DTO containing the athlete profile data.
   * @param supabase The Supabase client.
   */
  async createProfile(dto: CreateAthleteDto, supabase: SupabaseClient) {
    const user = await this.getAuthUser(supabase);
  
    const user_id = user.user.id
  
    // Seperate data for 'athletes' and 'users' table
    const { name, username, ...athleteFields } = dto;
  
    // Insert into 'users'
    const userData = { name, username };
    await this.addToTable(userData, 'users', supabase);
  
    // Insert into 'athletes'
    const athleteData = { ...athleteFields, user_id: user_id };
    await this.addToTable(athleteData, 'athletes', supabase);
  }

  /** Queries the database for the row with the same user_id as the current authenticated
   * user's id, fetching columns that make up the public profile of the athlete.
   * 
   * @param supabase The Supabase client. 
   * @returns An object containing the data of the public athlete profile.
   */
  async retrievePublicProfile(supabase: SupabaseClient) {
    return {};
  }

  /** Updates the column of the user in the 'athletes' table with the
   * value contained in the DTO. This method assumes that only ONE column
   * was updated, therefore the DTO contains one field.
   * 
   * @param updateUserDto The DTO containing the updated column value.
   * @param supabase The Supabase client.
   */
  async updateProfile(dto: UpdateUserDto, supabase: SupabaseClient) {

    // ensure only one new value is in DTO.
    const fieldCount = Object.values(dto).filter(value => value !== undefined).length;
  
    if (fieldCount !== 1) {
    throw new BadRequestException('Exactly one field must be provided for update');
    }

    const user = await this.getAuthUser(supabase);

    let table: string;
    let cond: string;

    if (dto.name || dto.username) {
      table = 'users';
      cond = 'id';
    } else {
      table = 'athletes';
      cond = 'user_id';
    }

    const { error } = await supabase
    .from(table)
    .update(dto)
    .eq(cond, user.user.id);

    if (error) {
      this.handleSupabaseError(error);
    }
  }

  // adds the object containing specific fields to the designated table.
  private async addToTable(data: any, table: string, supabase: SupabaseClient) {
    const { error } = await supabase.from(table).insert(data);

    if (error) {
     this.handleSupabaseError(error)
    }
  }

  private handleSupabaseError(error: any) {
    
  }

  // returns the authenticated user and ensures its non-null.
  private async getAuthUser(supabase: SupabaseClient) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      this.handleSupabaseError(error);
    }

    if (!data.user?.id) {
      throw new BadRequestException('Could not find user id.')
    }

    return data;
  }
}
