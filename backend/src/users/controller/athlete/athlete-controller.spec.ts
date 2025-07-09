import { SupabaseService } from 'src/supabase/supabase.service';
import { AthleteController } from './athlete.controller';
import { AthleteService } from 'src/users/service/athlete/athlete.service';

describe('AthleteController', () => {
  let controller: AthleteController;
  let supabaseService: SupabaseService;
  let athleteService: AthleteService;

  beforeEach(async () => {
    athleteService = {
      createProfile: jest.fn(),
      retrievePublicProfile: jest.fn(),
      updateProfile: jest.fn()
    } as unknown as jest.Mocked<AthleteService>;

    supabaseService = {
      getClient: jest.fn().mockReturnValue({})
    } as unknown as jest.Mocked<SupabaseService>;

    controller = new AthleteController(
      athleteService,
      supabaseService,
      supabaseService.getClient()
    )
    
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
    expect(athleteService.createProfile).toHaveBeenCalledWith(dto, supabaseService.getClient())
  });

  it('should return profile data from service', async () => {
    const mockProfile = { id: 1, name: 'Test Athlete', weight_class: '170lb' };
    jest.spyOn(athleteService, 'retrievePublicProfile').mockResolvedValue(mockProfile);
    
    const result = controller.retrievePublicProfile();
    
    expect(athleteService.retrievePublicProfile).toHaveBeenCalledWith(supabaseService.getClient());
    expect(result).resolves.toEqual(mockProfile);
  });

  it('controller.updateProfile makes correct calls and returns', async () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
    }

    const call = await controller.updateProfile(dto);
    expect(call).toEqual({ message: "Profile updated successfully"})
    expect(athleteService.updateProfile).toHaveBeenCalledWith(dto, supabaseService.getClient())
  });
});
