import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception-filter';
import { validationExceptionFactory } from 'src/common/validation/pipes/exception-factory';
import { useContainer } from 'class-validator';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { UpdateAthleteDto } from 'src/users/dto/athlete/update-athlete.dto';

/**
 * --- Update Profile ---
 * npm run test:e2e athlete-update.e2e
 * - Successful update of 'users' table column
 * - Successul update of federation
 * - Successul update of division
 * - Successful update of weight class
 * - Fail due to username already being taken
 * - Fail due to weight class not matching gender
 * - Fail due to weight class not matching federation
 * - Fail due to invalid division
 * - Fail due to division not matching federation
 * - Fail due to invalid federation
 */
describe('Athlete profile (POST) (e2e)', () => {
  let app: INestApplication<App>;
  let supabaseService: SupabaseService;
  let supabase: SupabaseClient;
  let dto;
  let profileLogin;
  let token;
  let successTests: Array<[string, UpdateAthleteDto, any]> = []
  let updateId = '05b2dd02-b33f-4f06-94a3-fb7ca8380852';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();
  
      app = moduleFixture.createNestApplication();

      useContainer(app.select(AppModule), { fallbackOnErrors: true });
  
      app.useGlobalPipes(new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        transformOptions: {
          enableImplicitConversion: true,
        },
        exceptionFactory: validationExceptionFactory
      }));

      app.useGlobalFilters(new GlobalExceptionFilter());
  
      await app.init(); // Start the NestJS app context


      profileLogin = {
        email: 'test-profile-update@gmail.com',
        password: 'test-update-101'
      }

      supabaseService = moduleFixture.get(SupabaseService);

      supabase = supabaseService.getClient()

    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    token = login.body.access_token;
  });

  afterEach(async () => {

    // delete record of updateProfile tests' row 
    const originalName = 'Christian';
    const originalUsername = 'cg_update_test_acc';
    const originalFedId = '6dd4a324-f5f0-4d62-a3e8-52aae276ea50';
    const originalDivId = 'a8da983e-3f7c-4070-affe-578b8f4db5fe';
    const originalWcId = 'e131fef7-3575-418e-bf64-eb48832d4c77';

    // reset user columns
    await supabase.from('users').update({
        name: originalName, 
        username: originalUsername
    }).eq('id', updateId);

    // reset athletes columns
    await supabase.from('athletes').update({
        federation_id: originalFedId,
        division_id: originalDivId,
        weight_class_id: originalWcId
    }).eq('user_id', updateId);
  })

  afterAll(async () => {
    await app.close(); // Move this here
})

  test(`Successful update of 'users' column`, async () => {
    dto = {name: 'Daniel'}
    const res = await request(app.getHttpServer())
    .patch('/athlete/profile')
    .set(`Authorization`, `Bearer ${token}`)
    .send(dto)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Profile updated successfully')

    const { data: newFed } = await supabase
  .from('federations')
  .select('*')
  .eq('id', '2339e288-bd79-4d91-b357-e5f5969a5223')
  .single()

    console.log('New federation exists?', newFed);

    const fed = await supabase
  .from('athletes')
  .select('federation_id')
  .eq('user_id', updateId)
  .single()

    console.log('Current federation_id in athletes table:', fed.data?.federation_id);

    const { data } = await supabase
    .from('athletes')
    .select('users (name)')
    .eq('user_id', updateId)
    .single()

    const users = data?.users as unknown as { 
        name: string; 
        username: string };

    expect(users.name).toBe(dto.name);
  })

  test(`Successful update of federation column`, async () => {
    dto = {federation: 'IPF'}
    const res = await request(app.getHttpServer())
    .patch('/athlete/profile')
    .set(`Authorization`, `Bearer ${token}`)
    .send(dto)

    expect(res.status).toBe(200)
    expect(res.body.message).toBe('Profile updated successfully')

    const { data } = await supabase
    .from('athletes')
    .select('federations (*)')
    .eq('user_id', updateId)
    .single()

    const federations = data?.federations as unknown as {
        code: string
    }

    expect(federations.code).toBe(dto.federation);
  })
});
