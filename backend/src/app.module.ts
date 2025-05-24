import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WorkoutsModule } from './workouts/workouts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { BlockModule } from './block/block.module';
import { ProgramModule } from './program/program.module';
@Module({
  imports: [WorkoutsModule, UsersModule, AuthModule, BlockModule, ProgramModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
