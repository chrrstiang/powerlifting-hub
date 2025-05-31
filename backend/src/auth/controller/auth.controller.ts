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

  // handles logic for signing up a new user.
  @Post('signup')
  signUp(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  // responsible for handling logic to log in a user.
  @Post('login')
  login(@Body() verifyAuthDto: CreateAuthDto) {
    return this.authService.login(verifyAuthDto)
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
