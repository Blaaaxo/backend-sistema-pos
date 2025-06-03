import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);

  // Configurar CORS
  app.enableCors(
    {
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    }
  );
}
bootstrap();
