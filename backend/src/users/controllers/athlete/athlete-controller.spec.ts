import { Test, TestingModule } from '@nestjs/testing';
import { AthleteController } from './athlete.controller';
import { AthleteService } from '../../services/athlete/athlete.service';

describe('AthleteController', () => {
  let controller: AthleteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AthleteController],
      providers: [AthleteService],
    }).compile();

    controller = module.get<AthleteController>(AthleteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
