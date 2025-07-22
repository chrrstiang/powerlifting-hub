import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception-filter';
import { validationExceptionFactory } from 'src/common/validation/pipes/exception-factory';
import { AthleteService } from 'src/users/service/athlete/athlete.service';
import { useContainer } from 'class-validator';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';
import { Gender } from 'src/users/dto/create-user.dto';

/** Test cases:
 * npm run test:e2e athlete-retrieve.e2e
 * --- Retrieve Profile ---
 * - Successful with no query (retrieve all fields)
 * - Successful with one field from 'users'
 * - Successul with one field from 'athletes'
 * - Fail due to invalid columns in query
 * - Fail due to user not being found
 * --- Update Profile ---
 * - Successful update of 'users' table column
 * - Successul update of 'athletes' table column
 * - Fail due to username already being taken
 * - Fail due to invalid weight class
 * - Fail due to invalid division
 * - Fail due to invalid federation
 * 
 */
describe('Athlete profile (GET) (e2e)', () => {
  let app: INestApplication<App>;
  let supabaseService: SupabaseService;
  let supabase: SupabaseClient;
  let athleteService: AthleteService;
  let profileLogin;
  let token;

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
        email: 'testing-profile-get@gmail.com',
        password: 'test-get-101'
      }

      supabaseService = moduleFixture.get(SupabaseService);

      athleteService = moduleFixture.get(AthleteService);

      supabase = supabaseService.getClient()

    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    token = login.body.access_token;
  });

  afterEach(async () => {
    await app.close();
  })

  it('retrieveProfileDetails successfully retrieves all retrievable fields with no query', async () => {
    const res = await request(app.getHttpServer())
    .get('/athlete/profile')

    expect(res.status).toBe(200);
    expect(res.body.message).toEqual({});
  })
});
