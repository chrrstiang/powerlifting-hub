import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { GlobalExceptionFilter } from './common/filters/global-exception-filter';
import { validationExceptionFactory } from './common/validation/pipes/exception-factory';
import { useContainer } from 'class-validator';

async function bootstrap() {

  console.log('⏱️  Creating app...');
  const start = Date.now();
  
  const app = await NestFactory.create(AppModule);

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

  await app.listen(process.env.PORT ?? 3000);

  console.log(`Started in ${Date.now() - start}ms`)
}
bootstrap();
