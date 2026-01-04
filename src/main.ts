import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { TelegramService } from './telegram/telegram.service';
import { AuditInterceptor } from './common/interceptors/audit.interceptor';


import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  )

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  //SWAGGER SETUP
  const config = new DocumentBuilder()
    .setTitle('TEMPLATE API')
    .setDescription('API')
    .setVersion('1.0')
    .addBearerAuth() 
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const telegramService = app.get(TelegramService);
  app.useGlobalInterceptors(new AuditInterceptor(telegramService));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
