import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: false,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('Petrol Station Management API')
    .setDescription(
      'Complete REST API for managing petrol stations, vehicles, fuel records, profits, and expenses.',
    )
    .setVersion('2.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter your JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Auth', 'Authentication endpoints — login, register, validate')
    .addTag('Users', 'User management')
    .addTag('Vehicles', 'Vehicle management')
    .addTag('Stations', 'Petrol station management')
    .addTag('Fuel Records', 'Fuel record tracking with payment logs')
    .addTag('Profits', 'Profit calculation and management')
    .addTag('Personal Expenses', 'Personal expense tracking')
    .addTag('Partner Expenses', 'Partner expense tracking')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 2018;
  await app.listen(port);

  console.log(`\n🚀 Petrol API is running on: http://localhost:${port}`);
  console.log(`📖 Swagger Docs available at: http://localhost:${port}/docs\n`);
}

bootstrap();
