import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { CreateCoachDto } from '../../dto/coach/create-coach.dto';
import { CoachService } from '../../services/coach/coach.service';

@Controller('users')
export class CoachController {
  constructor(private readonly coachService: CoachService) {}

  @Post()
  create(@Body() createCoachDto: CreateCoachDto) {
    return this.coachService.create(createCoachDto);
  }

  @Get()
  findAll() {
    return this.coachService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.coachService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.coachService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.coachService.remove(+id);
  }
}