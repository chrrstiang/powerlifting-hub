import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule], // Use full module so all routes & providers load
    }).compile();

    app = moduleFixture.createNestApplication();

    // Match main.ts configuration (e.g., global pipes)
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true, // strip unknown props
      forbidNonWhitelisted: true, // throw if unknown props
      transform: true, // auto-convert payloads to DTO instances
    }));

    await app.init(); // Start the NestJS app context
  });

  afterEach(async () => {
    await app.close(); // Clean up between tests
  });

  it('/auth/signup (POST) should return 201 for valid signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: 'test@email.com', password: 'ValidPassword123' });

    expect(res.status).toBe(201); // or whatever status your controller returns
  });
});
