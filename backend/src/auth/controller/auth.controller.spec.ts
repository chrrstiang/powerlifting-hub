import { SupabaseClient } from '@supabase/supabase-js';
import { AuthController } from '../controller/auth.controller';
import { AuthService } from '../service/auth.service';
import { SupabaseService } from 'src/supabase/supabase.service';

describe('AuthController', () => {
  let controller: AuthController;
  // creates mocked versions, where all functions are defined as mocks.
  let mockAuthService: jest.Mocked<AuthService>;
  let mockSupabaseService: jest.Mocked<SupabaseService>;
  let dto;

  beforeEach(() => {

    dto = {email: "helloemail@gmail.com", password: "This is my password"}

    mockAuthService = {
      createUser: jest.fn(),
      login: jest.fn(),
      logout: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<AuthService>;
    
    mockSupabaseService = {
      getClient: jest.fn().mockReturnValue({})
    } as unknown as jest.Mocked<SupabaseService>;
    

    controller = new AuthController(
      mockAuthService,
      mockSupabaseService
    );
  });

  it('should call createUser with DTO and Supabase client', () => {
    controller.signUp(dto);
    expect(mockAuthService.createUser).toHaveBeenCalledWith(dto, mockSupabaseService.getClient());
    expect(mockAuthService.createUser).toHaveBeenCalledTimes(1);
  });

  it('should call login with DTO and Supabase client', async () => {
    controller.login(dto);
    expect(mockAuthService.login).toHaveBeenCalledWith(dto, mockSupabaseService.getClient());
    expect(mockAuthService.login).toHaveBeenCalledTimes(1);
  })

  it('should call logout with Supabase client', async () => {
    controller.logout();
    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthService.logout).toHaveBeenCalledTimes(1);
  })

  it('should call update with DTO and Supabase client', async () => {
    controller.update(dto);
    expect(mockAuthService.update).toHaveBeenCalledWith(dto, mockSupabaseService.getClient())
    expect(mockAuthService.update).toHaveBeenCalledTimes(1);
  })
});
