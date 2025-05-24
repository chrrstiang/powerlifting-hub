import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutsModule } from './workouts/workouts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlockModule } from './block/block.module';
import { ProgramModule } from './program/program.module';
import { MovementModule } from './movement/movement.module';
import { ExerciseModule } from './exercise/exercise.module';

@Module({
  imports: [WorkoutsModule, UsersModule, AuthModule, BlockModule, ProgramModule, MovementModule, ExerciseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
