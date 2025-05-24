import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateCoachDto } from '../../dto/coach/create-coach.dto';
import { CoachService } from '../../service/coach/coach.service';

@Controller('users')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  /*
  Endpoint used when a Coach opens their roster

  Allows Coach to get alla thletes in their roster.
  */
  @Get('athletes')
  findAllAthletes() {
    return this.coachService.findAll();
  }

  /*
  Endpoint used when a Coach searches for a specific athlete

  Allows Coach to get a specific athlete in their roster.
  */
  @Get('athletes/:id')
  findAthlete(@Param('id') id: string) {
    return this.coachService.findOne(+id);
  }

  /*
  Endpoint used when a Coach opens their athlete's schedule

  Allows Coach to get a specific athlete's schedule.
  */
  @Get('athletes/:id/program')
  getAthletePrograms(@Param() id: string, ) {
    return this.coachService.findOne(+id);
  }


  @Patch('/athletes/:id/')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.coachService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}