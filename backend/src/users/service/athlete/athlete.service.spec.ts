import { BadRequestException, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { AthleteService } from './athlete.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { MissingIdException } from 'src/common/exceptions/missing-id';
import { SupabaseService } from 'src/supabase/supabase.service';
import { Gender } from 'src/users/dto/create-user.dto';

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
  let user;
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
          eq: jest.fn().mockReturnValue({
            eq: jest.fn().mockReturnValue({
              single: jest.fn().mockResolvedValue({
                data: {
                  id: 'weight-class-id'
                }
              })
            }),
            single: jest.fn().mockResolvedValue({
              data: {
                id : 'division-id'
              }
            })
          }),
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
        eq: jest.fn().mockResolvedValue({ data: {id: 'Some id'}, error: null }),
      }) 
    }

    supabase = {
      from: jest.fn().mockReturnValue(queries)
    } as unknown as jest.Mocked<SupabaseClient>;

    const supabaseService = {
      getClient: jest.fn().mockReturnValue(supabase)
    } as unknown as jest.Mocked<SupabaseService>;

    service = new AthleteService(supabaseService);

    dto = {
      name: 'Christian',
      username: 'chrrstian_',
      gender: Gender.MALE,
      date_of_birth: '2005-11-22',
      federation: "IPF",
      weight_class: '67.5kg',
      division: 'Junior'
    }

    user = {
      id: 'user-uuid'
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

  it('createProfile should succeed and call addToTable', async () => {

    const findFed = jest.spyOn(service as any, 'findFederation').mockResolvedValue('fed-id');
    const findDiv = jest.spyOn(service as any, 'findDivision').mockResolvedValue('div-id');
    const findWC = jest.spyOn(service as any, 'findWeightClass').mockResolvedValue('wc-id');

    const athleteData = {
      federation_id: 'fed-id',
      weight_class_id: 'wc-id',
      division_id: 'div-id',
      user_id: user.id
    }

    const userData = {
      name: dto.name,
      username: dto.username,
      gender: dto.gender,
      date_of_birth: dto.date_of_birth,
      role: 'Athlete'
    }

    const call = service.createProfile(dto, user)

    await expect(call).resolves.not.toThrow();
    expect(supabase.from('users').update).toHaveBeenCalledWith(userData);
    expect(addToTable).toHaveBeenCalledWith(athleteData, 'athletes');
    expect(addToTable).toHaveBeenCalledTimes(1);
  });

  it('createProfile should throw an error when insert returns an error', async () => {

    supabase.from('athletes').insert = jest.fn().mockResolvedValue({
      data: null,
      error: {
        message: 'I failed to insert',
        code: '23505'
      }
    })

    const call = service.createProfile(dto, user)

    await expect(call).rejects.toThrow(new BadRequestException(`An unexpected error occured for insert:
      23505 - I failed to insert`));
    expect(supabase.from('athletes').insert).toHaveBeenCalledTimes(1);
  });

  it('createProfile should throw an error when update returns an error', async () => {

    const dto = {name: 'name', username: 'user', gender: Gender.MALE, 
      date_of_birth: '2005-11-22'}

    supabase.from('users').update(dto).eq = jest.fn().mockResolvedValue({
      data: null,
      error: {
        message: 'I failed to update',
        code: '23505'
      }
    })

    const call = service.createProfile(dto, user)

    await expect(call).rejects.toThrow(new BadRequestException(`Failed to update user upon profile completion: 23505 - I failed to update`));
    expect(supabase.from('users').update(dto).eq).toHaveBeenCalledTimes(1);
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

    const updateCall = service.updateProfile(dto, user)

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

    const updateCall = service.updateProfile(dto, user)

    await expect(updateCall).resolves.not.toThrow();
    expect(supabase.from).toHaveBeenCalledWith('athletes');
    expect(mockAthletesChain.update).toHaveBeenCalledWith(dto);
    expect(mockAthletesChain.update).toHaveBeenCalledTimes(1);
  })

  it('updateProfile should throw an exception due to more than one DTO field.', async () => {

    const updateCall = service.updateProfile(dto, user);

    await expect(updateCall).rejects.toThrow(new BadRequestException(
      'Exactly one field must be provided for update.'))
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

    const updateCall = service.updateProfile(dto, user);

    await expect(updateCall).rejects.toThrow(new BadRequestException(
      `An unexpected error occured for update:
      45404 - I failed`))
    expect(supabase.from('athletes').update).toHaveBeenCalledWith(dto);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select for \'users\'', async () => {
    await service.retrieveProfileDetails(user, ['name', 'username']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith(`users(name,username)`)
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select for \'athletes\'', async () => {
    await service.retrieveProfileDetails(user, ['weight_class', 'division']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith(`weight_class,division`)
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select all (no arg)', async () => {
    await service.retrieveProfileDetails(user, undefined);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith('weight_class,division,team,users(name,username,email)')
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  it('retrieveProfileDetails should successfully passes the correct query to select all (individual)', async () => {
    await service.retrieveProfileDetails(user, ['name', 'username', 'email', 'weight_class', 'division', 'team']);

    expect(supabase.from('athletes').select).toHaveBeenCalledWith('weight_class,division,team,users(name,username,email)')
    expect(supabase.from('athletes').select).toHaveBeenCalledTimes(1);
  })

  // Add your specific tests here
});