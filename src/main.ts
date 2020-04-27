import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import * as config from 'config';

import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('bootstrap');

  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  if (process.env.NODE_ENV === 'development') {
    logger.log(`Accepting requests from all origins for env: [${process.env.NODE_ENV}]`);
    app.enableCors();
  }

  await app.listen(port);
  logger.log(`Application listening on port ${port}`);
}

bootstrap();
