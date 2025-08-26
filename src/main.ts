import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,  // strip properties not in DTO
    forbidNonWhitelisted: true, // throw error if extra properties exist in the body
    transform: true, // transform payloads to DTO instances
  }))
  const port = process.env.PORT ?? 3000;
  await app.listen(port as number, '0.0.0.0');
}
bootstrap();
