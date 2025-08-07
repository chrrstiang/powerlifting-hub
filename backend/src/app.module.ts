import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutsModule } from './workouts/workouts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlockModule } from './block/block.module';
import { ProgramModule } from './program/program.module';
import { ConfigModule } from '@nestjs/config';
import { SupabaseModule } from './supabase/supabase.module';
import { ValidatorsModule } from './common/validation/validators/validators.module';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule {}
