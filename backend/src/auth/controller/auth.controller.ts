import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from '../service/auth.service';
import { CreateAuthDto } from '../dto/create-auth.dto';
import { UpdateAuthDto } from '../dto/update-auth.dto';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
    private readonly supabaseService: SupabaseService
  ) {}

  /** Signs up an user of the application using their email and password.
   * 
   * @param createAuthDto The DTO containing the email and password of the user.
   */
  @Post('signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    this.authService.createUser(createAuthDto, this.supabaseService.getClient());
  }

  /** Logs an existing user into the application with their email and password.
   * 
   * @param verifyAuthDto The DTO containg the email and password used to log in.
   */
  @Post('login')
  login(@Body() verifyAuthDto: CreateAuthDto) {
    this.authService.login(verifyAuthDto, this.supabaseService.getClient());
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }
}
