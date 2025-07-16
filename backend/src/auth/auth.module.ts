import { Module } from '@nestjs/common';
import { AuthService } from './service/auth.service';
import { AuthController } from './controller/auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SupabaseModule } from 'src/supabase/supabase.module';
import { IsUniqueValidator } from 'src/common/validation/validators/unique.validator';

/*
Encapsulates logic regarding the authentication and authorization of users.
*/
@Module({
  imports: [UsersModule, SupabaseModule],
  controllers: [AuthController],
  providers: [AuthService, IsUniqueValidator],
})
export class AuthModule {}
