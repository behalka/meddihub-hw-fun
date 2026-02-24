import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { appConfig } from './config/app-config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // for MikroORM connection cleanup
  app.enableShutdownHooks();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  await app.listen(appConfig.APP_PORT);
}
bootstrap();
