import { Controller, Get, Post, Body, Patch, HttpCode, Query, UseGuards, Req, Param } from '@nestjs/common';
import { UpdateUserDto } from '../../dto/update-user.dto';
import { AthleteService } from '../../service/athlete/athlete.service';
import { CreateAthleteDto } from '../../dto/athlete/create-athlete.dto';
import { JwtAuthGuard } from 'src/common/validation/guards/auth-guard';
import { AthleteExistsGuard } from 'src/common/validation/guards/athlete-exists-guard';

@Controller('athlete')
export class AthleteController {
  constructor(
    private readonly athleteService: AthleteService) {}

  /** Creates an athlete row in the Supabase 'athletes' table for the current
     * authenticated user. The profile is created using the provided fields in the DTO, where a 
     * name and username are required, and the 'athlete' role is already assumed. 
     * 
     * @param createAthleteDto The DTO containing the athlete profile information.
     * @returns An object containing a success message.
     */
  @Post('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  async createProfile(@Body() createAthleteDto: CreateAthleteDto, @Req() req: any) {
    const user = req.user
    await this.athleteService.createProfile(createAthleteDto, user);
    return { message: 'Profile created successfully' }
  }

  /** Retrieves the public profile of the current athlete user. A public athlete profile can
   * contain their name, username, weight class, division and team.
   * 
   * @returns An object containing the fields of the public athlete profile.
   */
  @Get('profile/:id')
  @UseGuards(JwtAuthGuard, AthleteExistsGuard)
  @HttpCode(200)
  async retrieveProfileDetails(@Param('id') id: string, @Query('data') data?: string) {
    const columnsArray = data ? data.split(',') : undefined;
    return this.athleteService.retrieveProfileDetails(id, columnsArray);
  }

  /** Updates the athlete row with the same user_id value as the current 
   * authenticated user. Updated fields are given to the DTO and updated accordingly in the
   * athlete row.
   * 
   * @param updateUserDto The DTO containing the new values for the updated fields.
   * @returns An object containing a success message.
   */
  @Patch('profile')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  async updateProfile(@Body() updateUserDto: UpdateUserDto, @Req() req) {
    const user = req.user;
    this.athleteService.updateProfile(updateUserDto, user);
    return { message: 'Profile updated successfully' }
  }
}