import { BadRequestException, InternalServerErrorException } from "@nestjs/common";
import { PostgrestError, SupabaseClient } from "@supabase/supabase-js";
import { SupabaseService } from "src/supabase/supabase.service";
import { UpdateUserDto } from "../dto/update-user.dto";

export class UsersService {
    supabase: SupabaseClient;

  constructor(private readonly supabaseService: SupabaseService) {
    if (!this.supabaseService) {
      throw new InternalServerErrorException('SupabaseService is undefined');
    }
    this.supabase = this.supabaseService.getClient()
  }

  /** Updates the column of the user in the 'athletes' table with the
   * value contained in the DTO. This method assumes that only ONE column
   * was updated, therefore the DTO contains one field.
   * 
   * @param updateUserDto The DTO containing the updated column value.
   */
  async updateProfile(dto: UpdateUserDto, user: any) {

    const { data, error } = await this.supabase
    .from('users')
    .update(dto)
    .eq('id', user.id)

    if (error) {
      UsersService.handleSupabaseError(error, 'update');
    }
  }

  // given an error returned by Supabase, displays an appropriate message 
  static handleSupabaseError(error: PostgrestError, operation: string) {
    throw new BadRequestException(`An unexpected error occured for ${operation}:
      ${error.code} - ${error.message}`);
  }
}