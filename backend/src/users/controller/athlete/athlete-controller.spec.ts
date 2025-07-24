import { Gender } from 'src/users/dto/create-user.dto';
import { AthleteController } from './athlete.controller';
import { AthleteService } from 'src/users/service/athlete/athlete.service';

describe('AthleteController', () => {
  let controller: AthleteController;
  let athleteService: AthleteService;
  let user;
  let request;

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

    request = {
      user: {
        id: 'user-uuid'
      }
    }
    
  });

  it('controller.createProfile makes correct calls and returns', async () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      gender: Gender.MALE,
      date_of_birth: '2005-11-22',
      weight_class: '67.5kg',
      division: 'Junior',
      team: 'Northeastern Powerlifting',
    }

    const call = await controller.createProfile(dto, request);
    expect(call).toEqual({ message: "Profile created successfully"})
    expect(athleteService.createProfile).toHaveBeenCalledWith(dto, request.user)
  });

  it('retrieveProfileDetails should return profile data from service', async () => {
    const result = controller.retrieveProfileDetails('some-uuid', 'name,username,weight_class');
    
    expect(athleteService.retrieveProfileDetails).toHaveBeenCalledWith('some-uuid', ['name', 'username', 'weight_class']);
    expect(result).resolves.toEqual({
      name: 'christian', username: 'chrrstian', weight_class: '67.5kg'
    });
  });

  it('should return profile data from service', async () => {
    controller.retrieveProfileDetails('some-uuid', undefined);
    
    expect(athleteService.retrieveProfileDetails).toHaveBeenCalledWith('some-uuid', undefined);
  });

  it('controller.updateProfile makes correct calls and returns', async () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
    }

    const call = await controller.updateProfile(dto, request);
    expect(call).toEqual({ message: "Profile updated successfully"})
    expect(athleteService.updateProfile).toHaveBeenCalledWith(dto, request.user)
  });
});
