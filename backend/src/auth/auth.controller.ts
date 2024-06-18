import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ApiResponse } from '../common/dto/api-response.dto';
import { SignInResponse } from './types/sign-in-response.type';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { RegisterDto } from './dto/register.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { v4 as uuid4 } from 'uuid';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('login')
  login(@Body() loginDto: LoginDto): Promise<ApiResponse<SignInResponse>> {
    return this.authService.login(loginDto);
  }
  @Post('register')
  @SkipAuth()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join('uploads', 'users'),
        filename: (_, file, cb) => {
          const filename = uuid4();
          cb(null, `${filename}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  register(
    @Body() registerDto: RegisterDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
  ): Promise<ApiResponse<SignInResponse>> {
    return this.authService.register(registerDto, file);
  }
}
