import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { PrismaFilter } from './exception-filters/prisma.filter';
import { WebSocketExceptionFilter } from './exception-filters/websocket.filter';
import { ValidationExceptionFilterFilter } from './exception-filters/validation.filter';
// import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new WebSocketExceptionFilter());
  app.useGlobalFilters(new PrismaFilter());
  app.useGlobalFilters(new ValidationExceptionFilterFilter())

  // // swagger configuration
  // const swaggerConfig = new DocumentBuilder().setTitle('Pong').setDescription('transcendence project api documentation').setVersion('1.0').build();
  // const document = SwaggerModule.createDocument(app, swaggerConfig);
  // SwaggerModule.setup('docs', app, document);
  
  await app.listen(3000);
}
bootstrap();
