import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { SupabaseService } from 'src/supabase/supabase.service';
import { SupabaseClient } from '@supabase/supabase-js';

describe('Auth E2E Tests', () => {
  let app: INestApplication;
  let supabase: SupabaseClient;
  let supabaseService: SupabaseService;

  const testValidEmail = 'christiantestemail@gmail.com';
  const testValidPassword = 'ExamplePassword101';

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }));

    await app.init(); // Start the NestJS app context

    supabaseService = moduleFixture.get(SupabaseService);
    supabase = supabaseService.getClient();

    try {
    // existing user for login/logout tests
    await supabase.auth.signUp({
        email: 'cg0712860@gmail.com',
        password: 'AnotherPassword101'
    })
  } catch (e) {
    throw new Error("Sign up in setup failed.");
  }
  });

  afterEach(async () => {
    const supabase = supabaseService.getClient();

    // delete user from auth
    const { data } = await supabase.auth.admin.listUsers();
    const users = data.users as { id: string; email?: string }[];
    const user = users.find((u) => u.email === testValidEmail);

    if (user) {
      await supabase.auth.admin.deleteUser(user.id);
    }

    // delete record from users table
    await supabase.from('users').delete().eq('email', testValidEmail);

    await app.close();
  });

  // Successful signup E2E test with a valid email and password.
  it('/auth/signup (POST) should return 201 for valid signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testValidEmail, password: testValidPassword });

    const { data: user } = await supabase
    .from('users')
    .select("*")
    .eq('email', testValidEmail)
    .single();

    // ensure user exists in table
    expect(user).toBeDefined()
    expect(user.id).toBeDefined()

    const { data } = await supabase.auth.admin.getUserById(user.id);

    // check if user exists in auth
    expect(data.user).toBeDefined();
    
    // check if user exists in 'users' table
    expect(user).toBeDefined();

    // check if auth user's email matches the given email
    expect(data?.user?.email).toBe(testValidEmail);

    // check if 'users' record's email matches the given email
    expect(user.email).toBe(testValidEmail);

    // checks if the request's status is as expected
    expect(res.status).toBe(201);

    // checks if they request's body is as expected
    expect(res.body).toEqual({ message: 'User created successfully' });
  });

  it('/auth/signup (POST) should return status 500 for missing email', async () => {
    const res = await request(app.getHttpServer())
    .post('/auth/signup')
    .send({password: 'DecoyPassword'})

    expect(res.status).toBe(400);
    expect(res.body.message).toEqual(['email must be an email', 'email should not be empty']);
  })

  // Successful login E2E test with a valid email/password
  it('/auth/login (POST) should return 200 for a valid login', async () => {

    const email= 'cg0712860@gmail.com'
    const password = 'AnotherPassword101';

    const res = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: email, password: password })

    // check response status
    expect(res.status).toBe(200);

    // check response (login was successful if this was returned)
    expect(res.body).toEqual({ message: 'Login successful'});
  })

  // Successful logout E2E test with a valid email/password
  it('/auth/logout (POST) should return 200 for a valid logout', async () => {

    const email= 'cg0712860@gmail.com'
    const password = 'AnotherPassword101';

    const res = await request(app.getHttpServer())
    .post('/auth/logout')
    .send({ email: email, password: password })

    // check response status
    expect(res.status).toBe(200);

    // check response (login was successful if this was returned)
    expect(res.body).toEqual({ message: 'Logout successful'});
  })
});
