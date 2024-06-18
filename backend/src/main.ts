import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import {
  Logger,
  VERSION_NEUTRAL,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
// import helmet from 'helmet';

import { ApiResponseInterceptor } from './common/interceptors/api-response.interceptor';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get(ConfigService);

  const logger = new Logger();

  // app.use(helmet());

  app.enableCors();

  app.setGlobalPrefix('api', { exclude: ['/uploads/(.*)'] });

  app.enableVersioning({
    defaultVersion: [VERSION_NEUTRAL, '1'],
    type: VersioningType.URI,
  });

  app.useGlobalPipes(new ValidationPipe());

  app.useGlobalInterceptors(new ApiResponseInterceptor());
  app.enableShutdownHooks();

  const port = configService.get<number>('port');

  await app.listen(port as number);
  logger.log(`Application is running on port: ${port}`);
}
bootstrap();
