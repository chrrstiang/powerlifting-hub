import { Module } from '@nestjs/common';
import { AppController } from './controllers/app.controller';
import { AppService } from './services/app.service';
import { WorkoutsModule } from './workouts/workouts.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [WorkoutsModule, UsersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
