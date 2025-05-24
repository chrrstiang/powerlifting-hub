import { Module } from '@nestjs/common';
import { AthleteController } from './controller/athlete/athlete.controller';
import { CoachController } from './controller/coach/coach.controller';
import { AthleteService } from './service/athlete/athlete.service';
import { CoachService } from './service/coach/coach.service';

// represents a user of the application. Can be a Coach or Athlete.
@Module({
  controllers: [AthleteController, CoachController],
  providers: [AthleteService, CoachService],
})
export class UsersModule {}
