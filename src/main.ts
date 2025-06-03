import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 4000);

  // Configurar el parser de cookies
  app.use(cookieParser());

  // Configurar CORS
  app.enableCors(
    {
      origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      credentials: true, // Permitir credenciales (cookies, autenticación HTTP)
    }
  );
}
bootstrap();
