import { Module } from '@nestjs/common';
import { ProgramService } from './service/program.service';
import { ProgramController } from './controller/program.controller';

// represents an Athlete's training program, provided by a Coach. Includes training blocks,
// workouts and exercises.
@Module({
  controllers: [ProgramController],
  providers: [ProgramService],
})
export class ProgramModule {}
