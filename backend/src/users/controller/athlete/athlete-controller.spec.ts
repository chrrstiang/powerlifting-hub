import { AthleteController } from './athlete.controller';
import { AthleteService } from 'src/users/service/athlete/athlete.service';

describe('AthleteController', () => {
  let controller: AthleteController;
  let athleteService: AthleteService;

  beforeEach(async () => {
    athleteService = {
      createProfile: jest.fn(),
      retrieveProfileDetails: jest.fn().mockResolvedValue({
        name: 'christian',
        username: 'chrrstian',
        weight_class: '67.5kg'
      }),
      updateProfile: jest.fn()
    } as unknown as jest.Mocked<AthleteService>;

    controller = new AthleteController(athleteService)
    
  });

  it('controller.createProfile makes correct calls and returns', async () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
      division: 'Junior',
      team: 'Northeastern Powerlifting',
    }

    const call = await controller.createProfile(dto);
    expect(call).toEqual({ message: "Profile created successfully"})
    expect(athleteService.createProfile).toHaveBeenCalledWith(dto)
  });

  it('should return profile data from service', async () => {
    const result = controller.retrieveProfileDetails('name,username,weight_class');
    
    expect(athleteService.retrieveProfileDetails).toHaveBeenCalledWith(['name', 'username', 'weight_class']);
    expect(result).resolves.toEqual({
      name: 'christian', username: 'chrrstian', weight_class: '67.5kg'
    });
  });

  it('controller.updateProfile makes correct calls and returns', async () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
    }

    const call = await controller.updateProfile(dto);
    expect(call).toEqual({ message: "Profile updated successfully"})
    expect(athleteService.updateProfile).toHaveBeenCalledWith(dto)
  });
});
