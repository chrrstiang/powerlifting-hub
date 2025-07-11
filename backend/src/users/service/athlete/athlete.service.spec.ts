import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { MissingIdException } from 'src/common/exceptions/missing-id';
import { SupabaseService } from 'src/supabase/supabase.service';

/** Unit tests for Athlete Service class:
 * 
 * - Profile creation, update and retrieve methods tested, ensuring proper
 * calls of methods with proper data. Also tests that the correct exceptions 
 * and messages are thrown.
 * 
 */

describe('AthleteService', () => {
  let service: AthleteService;
  let supabase: SupabaseClient;
  let dto;
  let addToTable;
  let mockUsersChain;
  let mockAthletesChain;
  let mockEq; 

  beforeEach(async () => {
    const queries = {
      insert: jest.fn().mockResolvedValue({
        data: {},
        error: null
      }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          single: jest.fn().mockResolvedValue({
            data: {
              name: 'christian',
              username: 'chrrstian'
            },
            error: null
          })
        })
      }),
      update: jest.fn().mockReturnValue({
        eq: jest.fn().mockResolvedValue({ data: {}, error: null }),
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

    const supabaseService = {
      getClient: jest.fn().mockReturnValue(supabase)
    } as unknown as jest.Mocked<SupabaseService>;

    service = new AthleteService(supabaseService);

    dto = {
      name: 'Christian',
      username: 'chrrstian_',
      weight_class: '67.5kg',
      division: 'Junior'
    }

    addToTable = jest.spyOn(service as any, 'addToTable');

    mockUsersChain = {
      update: jest.fn().mockReturnValue({ eq: mockEq })
    };
    
    mockAthletesChain = {
      update: jest.fn().mockReturnValue({ eq: mockEq })
    };

    mockEq = jest.fn().mockResolvedValue({ error: null });
  });

  it('createProfile should successfully call getUser which contains data and call addToTable', async () => {

    const athleteData = {
      weight_class: dto.weight_class,
      division: dto.division,
      user_id: 'user-uuid'
    }

    const userData = {
      name: dto.name,
      username: dto.username
    }

    const call = service.createProfile(dto)

    await expect(call).resolves.not.toThrow();
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(addToTable).toHaveBeenCalledWith(userData, 'users');
    expect(addToTable).toHaveBeenCalledWith(athleteData, 'athletes');
    expect(addToTable).toHaveBeenCalledTimes(2);
  });

  it('createProfile should throw an error when getUser returns an auth error code', async () => {

    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: null,
      error: {
        statusCode: 401,
        code: 'session_not_found'
      }
    })

    const call = service.createProfile(dto)

    await expect(call).rejects.toThrow(new UnauthorizedException('Authentication failed. Please log in again.'));
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(0);
  });

  it('createProfile should throw an error when getUser returns an unknown error', async () => {

    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: null,
      error: {
        statusCode: 401,
        message: 'I failed for some reason',
        code: '23011'
      }
    })

    const call = service.createProfile(dto)

    await expect(call).rejects.toThrow(new InternalServerErrorException(`An unexpected error occured for getUser:
      23011 - I failed for some reason`));
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(0);
  });

  it('createProfile should throw an error when getUser returns empty data (no ID)', async () => {

    supabase.auth.getUser = jest.fn().mockResolvedValue({
      data: {},
      error: null
    })

    const call = service.createProfile(dto)

    await expect(call).rejects.toThrow(new MissingIdException());
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(0);
  });

  it('createProfile should throw an error when insert returns an error', async () => {

    supabase.from('athletes').insert = jest.fn().mockResolvedValue({
      data: null,
      error: {
        message: 'I failed',
        code: '23505'
      }
    })

    const call = service.createProfile(dto)

    await expect(call).rejects.toThrow(new BadRequestException(`An unexpected error occured for insert:
      23505 - I failed`));
    expect(supabase.auth.getUser).toHaveBeenCalledTimes(1);
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(1);
  });

  it('updateProfile should successfully call update on \'users\' without throwing any errors', async () => {

    let dto = {
      username: 'new unique username'
    }

    supabase.from = jest.fn().mockImplementation((table: string) => {
      if (table === 'users') return mockUsersChain;
      if (table === 'athletes') return mockAthletesChain;
      throw new Error(`Unexpected table: ${table}`);
    });

    const updateCall = service.updateProfile(dto)

    await expect(updateCall).resolves.not.toThrow();
    expect(supabase.from).toHaveBeenCalledWith('users');
    expect(mockUsersChain.update).toHaveBeenCalledWith(dto);
    expect(mockUsersChain.update).toHaveBeenCalledTimes(1);
  })

  it('updateProfile should successfully call update on \'athletes\' without throwing any errors', async () => {

    let dto = {
      weight_class: '140kg+'
    }

    supabase.from = jest.fn().mockImplementation((table: string) => {
      if (table === 'users') return mockUsersChain;
      if (table === 'athletes') return mockAthletesChain;
      throw new Error(`Unexpected table: ${table}`);
    });

    const updateCall = service.updateProfile(dto)

    await expect(updateCall).resolves.not.toThrow();
    expect(supabase.from).toHaveBeenCalledWith('athletes');
    expect(mockAthletesChain.update).toHaveBeenCalledWith(dto);
    expect(mockAthletesChain.update).toHaveBeenCalledTimes(1);
  })

  it('updateProfile should throw an exception due to more than one DTO field.', async () => {

    const updateCall = service.updateProfile(dto);

    await expect(updateCall).rejects.toThrow(new BadRequestException(
      'Exactly one field must be provided for update.'))
    expect(supabase.auth.getUser).not.toHaveBeenCalled();
    expect(supabase.from).not.toHaveBeenCalled();
  })

  it('updateProfile should throw an exception when update returns an error', async () => {
    let dto = {
      name: 'christian'
    }

    supabase.from('users').update(dto).eq = jest.fn().mockResolvedValue({
      data: null,
      error: {
        message: 'I failed',
        code: 45404
      }
    })

    const updateCall = service.updateProfile(dto);

    await expect(updateCall).rejects.toThrow(new BadRequestException(
      `An unexpected error occured for update:
      45404 - I failed`))
    expect(supabase.auth.getUser).toHaveBeenCalled();
    expect(supabase.from('athletes').update).toHaveBeenCalledWith(dto);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select for \'users\'', async () => {
    await service.retrieveProfileDetails(['name', 'username']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith(`users(name,username)`)
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select for \'athletes\'', async () => {
    await service.retrieveProfileDetails(['weight_class', 'division']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith(`weight_class,division`)
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select all (no arg)', async () => {
    await service.retrieveProfileDetails(undefined);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith('weight_class,division,users(name,username,email)')
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select all (individual)', async () => {
    await service.retrieveProfileDetails(['name', 'username', 'email', 'weight_class', 'division']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith('weight_class,division,users(name,username,email)')
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  // Add your specific tests here
});