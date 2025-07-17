import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from 'src/app.module';
import { GlobalExceptionFilter } from 'src/common/filters/global-exception-filter';
import { validationExceptionFactory } from 'src/common/validation/pipes/exception-factory';
import { AthleteService } from 'src/users/service/athlete/athlete.service';
import { useContainer } from 'class-validator';

/** Test cases:
 * npm run test:e2e athlete.e2e-spec.ts
 * --- Create Profile ---
 * - Successful with all fields
 * - Successful with only required fields
 * - Successful with a few optional fields
 * - Fail due to missing required field
 * - Fail due to taken username
 * - Fail due to invalid weight class
 * - Fail due to invalid federation
 * - Fail due to invalid division
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
describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let athleteService;
  let dto;
  let profileLogin;

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

      athleteService = moduleFixture.get(AthleteService);

      profileLogin = {
        email: 'testingprofilecreate@gmail.com',
        password: 'test-create-101'
      }
  });

  afterEach(async () => {
    await app.close();
  })

  it('createProfile successfully creates athletes record and updates user record with all possible fields', async () => {

    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    const token = login.body.access_token;

    dto = {
        name: 'christian',
        username: 'chrrstian',
        weight_class: '67.5kg',
        division: "Men's Junior",
        team: "Northeastern Powerlifting"
    }

    const res = await request(app.getHttpServer())
    .post('/athlete/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(dto);

    console.log(res.body)

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Profile created successfully');
  })
});
