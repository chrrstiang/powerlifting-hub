import { Injectable } from '@nestjs/common';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {

  /** Given a DTO with an inputted email and password, a user is logged into their account.
   * 
   * @param createAuthDto The DTO containing the email and password to use to log in.
   * @param supabase The Supabase client.
   * 
   * @throws if the email doesn't exist or if the password is incorrect.
   */
  async login(body: CreateAuthDto, supabase: SupabaseClient) {
    try {

    const { data, error } = await supabase.auth.signInWithPassword({
      email: body.email,
      password: body.password
    })

    if (error) throw new Error("Failed to login user.");

  } catch (error) {
    throw new Error(error.message);
  }

  }

  /** Creates a new user of the application. The user is created in the Auth table, 
   * and manually stored in the 'users' table with their email and password.
   * 
   * @param createAuthDto The DTO containing the email and password of the new user.
   * @param supabase The Supabase client.
   * 
   */
  async createUser(createAuthDto: CreateAuthDto, supabase: SupabaseClient) {

    const email = createAuthDto.email;
    const password = createAuthDto.password;

    const id = await this.registerUser(email, password, supabase);

    await this.addToTable(email, id, supabase);
  }

  // Registers a User with Supabase Auth.
  private async registerUser(email: string, password: string, supabase: SupabaseClient) {

    try {

    const {data, error} =  await supabase.auth.signUp({
      email: email,
      password: password
    })

    if (error || !data?.user?.id) throw new Error("Could not sign up user.");

    return data.user.id;

  } catch (error) {
    throw new Error(error.message);
  }

  }

  // Adds the newly authenticated user to the 'users' table.
  private async addToTable(email: string, id: string, supabase: SupabaseClient) {
    try {
    const { data, error } = await supabase
      .from('users')
      .insert({
        id: id,
        email: email
    })

    if (error) throw new Error("Failed to store user in 'users' table.")
    } catch (error) {
      throw new Error(error.message);
    }
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }
}
