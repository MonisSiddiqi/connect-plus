import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { join } from 'node:path';

import { configValidationSchema } from './config/config-validation.schema';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { UploadsController } from './uploads.controller';
import { PrismaModule } from './prisma/prisma.module';
import configuration from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PostModule } from './post/post.module';
import { FollowingModule } from './following/following.module';
import { SearchModule } from './search/search.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: ['.env', `.env.${process.env.NODE_ENV}`],
      load: [configuration],
      validationSchema: configValidationSchema,
      validationOptions: {
        convert: true,
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'www-client'),
      exclude: ['/api/(.*)', '/uploads/(.*)'],
    }),
    PrismaModule,
    AuthModule,
    PostModule,
    UserModule,
    FollowingModule,
    SearchModule,
  ],
  controllers: [UploadsController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
