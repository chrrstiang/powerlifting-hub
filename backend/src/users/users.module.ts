import { Module } from '@nestjs/common';
import { AthleteController } from './controller/athlete/athlete.controller';
import { CoachController } from './controller/coach/coach.controller';
import { AthleteService } from './service/athlete/athlete.service';
import { CoachService } from './service/coach/coach.service';
import { SupabaseService } from 'src/supabase/supabase.service';

/* 
Module encapsulating logic and information regarding users. Two types
of users are Athletes and Coaches, which contain their own services and controllers.
*/
@Module({
  controllers: [AthleteController, CoachController],
  providers: [AthleteService, CoachService, SupabaseService],
})
export class UsersModule {}
