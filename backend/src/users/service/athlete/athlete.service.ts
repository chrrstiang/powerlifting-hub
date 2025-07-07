import { Injectable } from '@nestjs/common';
import { CreateUserDto } from '../../dto/create-user.dto';
import { UpdateUserDto } from '../../dto/update-user.dto';import { SupabaseClient } from '@supabase/supabase-js';
;

@Injectable()
export class AthleteService {
  
  // responsible for creating an Athlete user
  async createProfile(dto: CreateUserDto, supabase: SupabaseClient) {
    return 'This action adds a new athlete';
  }

  async retrievePublicProfile(supabase: SupabaseClient) {
    return {};
  }

  async updateProfile(updateUserDto: UpdateUserDto, supabase: SupabaseClient) {
    return `This action updates a user`;
  }
}