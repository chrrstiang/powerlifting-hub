import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { AthleteService } from '../../services/athlete/athlete.service';
import { CreateAthleteDto } from '../../dto/athlete/create-athlete.dto';

@Controller('users')
export class AthleteController {
  constructor(private readonly athleteService: AthleteService) {}

  @Post()
  create(@Body() createAthleteDto: CreateAthleteDto) {
    return this.athleteService.create(createAthleteDto);
  }

  @Get()
  findAll() {
    return this.athleteService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.athleteService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.athleteService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.athleteService.remove(+id);
  }
}