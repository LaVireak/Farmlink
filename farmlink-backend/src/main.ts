import { NestFactory } from '@nestjs/core';
import { json, urlencoded } from 'express';
import * as express from 'express';
import * as path from 'path';
import { AppModule } from './app.module';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
  const origins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://mobile-pc-builder.vercel.app',
    'https://ffarmllink.vercel.app',
  ];
  if (process.env.FRONTEND_URL) {
    origins.push(process.env.FRONTEND_URL);
  }
  app.enableCors({
    origin: origins,
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
