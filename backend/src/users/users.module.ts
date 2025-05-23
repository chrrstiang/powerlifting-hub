import { Module } from '@nestjs/common';
import { AthleteController } from './controllers/athlete/athlete.controller';
import { CoachController } from './controllers/coach/coach.controller';
import { AthleteService } from './services/athlete/athlete.service';
import { CoachService } from './services/coach/coach.service';

@Module({
  controllers: [AthleteController, CoachController],
  providers: [AthleteService, CoachService],
})
export class UsersModule {}
