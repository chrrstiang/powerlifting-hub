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

/** Test cases:
 * npm run test:e2e athlete.e2e-spec.ts
 * --- Create Profile ---
 * - Successful with all fields -- line 92
 * - Successful with only required fields -- line 144
 * - Successful with a few optional fields -- line 191
 * - Fail due to missing required field -- line 239
 * - Fail due to taken username -- line 266
 * - Fail due to invalid weight class -- SKIP
 * - Fail due to invalid federation -- SKIP
 * - Fail due to invalid division -- SKIP
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
  let supabaseService: SupabaseService;
  let supabase: SupabaseClient;
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


      profileLogin = {
        email: 'testingprofilecreate@gmail.com',
        password: 'test-create-101'
      }

      supabaseService = moduleFixture.get(SupabaseService);

      supabase = supabaseService.getClient()
  });

  afterEach(async () => {

    // delete record of createProfile tests' row 
    const createId = 'e5138b35-d40e-41e3-b238-c26b0c26757f'
    await supabase.from('users').update({name: null, username: null, role: null}).eq('id', createId);
    await supabase.from('athletes').delete().eq('user_id', createId);

    await app.close();
  })

  it('POST /athlete/profile successfully creates athletes record and updates user record with all possible fields', async () => {

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

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Profile created successfully');

    const { data: user } = await supabase.auth.getUser(token);
    const id = user?.user?.id;

    const { data, error } = await supabase
    .from('athletes')
    .select('weight_class,division,team,users(name,username,role)')
    .eq('user_id', id)
    .single()

    if (error) {
        throw new Error(error.message)
    }

    // athlete columns
    expect(data.division).toEqual(dto.division)
    expect(data.weight_class).toEqual(dto.weight_class)
    expect(data.team).toEqual(dto.team)

    // type cast data.users (giving compiling error for some reason)
    const users = data.users as unknown as { name: string; username: string, role: string };
    expect(users.name).toEqual(dto.name);
    expect(users.username).toEqual(dto.username);
    expect(users.role).toEqual('Athlete')
  })

  it('POST /athlete/profile successfully creates athletes record and updates user record with only required fields', async () => {

    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    const token = login.body.access_token;

    dto = {
        name: 'christian',
        username: 'chrrstian'
    }

    const res = await request(app.getHttpServer())
    .post('/athlete/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(dto);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Profile created successfully');

    const { data: user } = await supabase.auth.getUser(token);
    const id = user?.user?.id;

    const { data, error } = await supabase
    .from('athletes')
    .select('user_id,users(name,username,role)')
    .eq('user_id', id)
    .single()

    if (error) {
        throw new Error(error.message)
    }

    // 'athletes' record still created
    expect(data.user_id).toEqual(id);

    // type cast again, checking users columns
    const users = data.users as unknown as { name: string; username: string, role: string };
    expect(users.name).toEqual(dto.name);
    expect(users.username).toEqual(dto.username);
    expect(users.role).toEqual('Athlete')
  })

  it('POST /athlete/profile successfully creates athletes record and updates user record with a few optional fields', async () => {

    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    const token = login.body.access_token;

    dto = {
        name: 'christian',
        username: 'chrrstian',
        division: "Men's Junior"
    }

    const res = await request(app.getHttpServer())
    .post('/athlete/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(dto);

    expect(res.status).toBe(201);
    expect(res.body.message).toBe('Profile created successfully');

    const { data: user } = await supabase.auth.getUser(token);
    const id = user?.user?.id;

    const { data, error } = await supabase
    .from('athletes')
    .select('user_id, division, users(name,username,role)')
    .eq('user_id', id)
    .single()

    if (error) {
        throw new Error(error.message)
    }

    expect(data.user_id).toEqual(id);
    expect(data.division).toEqual(dto.division)

    // type cast again, checking users columns
    const users = data.users as unknown as { name: string; username: string, role: string };
    expect(users.name).toEqual(dto.name);
    expect(users.username).toEqual(dto.username);
    expect(users.role).toEqual('Athlete')
  })

  it('POST /athlete/profile fails due to missing required field (no name)', async () => {
    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    const token = login.body.access_token;

    dto = {
        username: 'chrrstian',
        weight_class: '67.5kg',
        division: "Men's Junior",
        team: "Northeastern Powerlifting"
    }

    const res = await request(app.getHttpServer())
    .post('/athlete/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(dto);

    expect(res.status).toBe(400);
    // can't predict exact message, but checks to see if message is about the name.
    expect(res.body.message).toContain('name');
  })

  it('POST /athlete/profile fails due to taken username', async () => {
    const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send(profileLogin)

    expect(login.status).toBe(200);
    expect(login.body.message).toBe('Login successful');

    const token = login.body.access_token;

    dto = {
        name: 'christian',
        username: 'username-alr-taken',
        weight_class: '67.5kg',
        division: "Men's Junior",
        team: "Northeastern Powerlifting"
    }

    const res = await request(app.getHttpServer())
    .post('/athlete/profile')
    .set('Authorization', `Bearer ${token}`)
    .send(dto);

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Username is already taken');
  })
});
