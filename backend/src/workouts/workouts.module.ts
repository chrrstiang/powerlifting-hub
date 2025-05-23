import { Module } from '@nestjs/common';
import { WorkoutsService } from './services/workouts.service';
import { WorkoutsController } from './controllers/workouts.controller';

@Module({
  controllers: [WorkoutsController],
  providers: [WorkoutsService],
})
export class WorkoutsModule {}
