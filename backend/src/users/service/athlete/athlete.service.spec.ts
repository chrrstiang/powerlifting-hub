import { AthleteService } from './athlete.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('AthleteService', () => {
  let service: AthleteService;
  let supabase: SupabaseClient; 

  beforeEach(async () => {
    const queries = {
      insert: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }),
      select: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }),
      upsert: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }) 
    }

    supabase = {
      from: jest.fn().mockReturnValue(queries),
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: {id: 'user-uuid'}},
          error: null
        })
      }
    } as unknown as jest.Mocked<SupabaseClient>;

    service = new AthleteService();
  });

  it('createProfile should successfully call getUser which contains data and call insert', () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
      division: 'Junior'
    }

    const call = service.createProfile(dto, supabase)

    expect(call).resolves.not.toThrow();
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledWith(dto);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(1);
  });

  it('createProfile should throw an error when getUser returns an error', () => {
    const dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
      division: 'Junior'
    }

    const call = service.createProfile(dto, supabase)

    expect(call).resolves.not.toThrow();
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledWith(dto);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(1);
  });

  // Add your specific tests here
});