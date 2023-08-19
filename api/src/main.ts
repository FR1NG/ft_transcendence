import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from './exception-filters/prisma.filter';
import { WebSocketExceptionFilter } from './exception-filters/websocket.filter';
import { ValidationExceptionFilterFilter } from './exception-filters/validation.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new WebSocketExceptionFilter());
  app.useGlobalFilters(new PrismaFilter());
  app.useGlobalFilters(new ValidationExceptionFilterFilter())
  await app.listen(3000);
}
bootstrap();
