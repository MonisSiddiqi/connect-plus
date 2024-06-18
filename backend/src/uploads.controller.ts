import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { Response } from 'express';
import { join } from 'node:path';
import { SkipAuth } from './auth/decorators/skip-auth.decorator';

@Controller({
  path: 'uploads',
  version: VERSION_NEUTRAL,
})
export class UploadsController {
  /*serving user photo*/
  @SkipAuth()
  @Get('users/:fileId')
  async serveUserProfile(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      res.sendFile(fileId, {
        root: join('uploads', 'users'),
      });
    } catch (err) {
      throw new NotFoundException('File Not Found');
    }
  }
  /*serving page photo*/
  @SkipAuth()
  @Get('posts/:fileId')
  async servePagePhoto(
    @Param('fileId') fileId: string,
    @Res() res: Response,
  ): Promise<any> {
    try {
      res.sendFile(fileId, {
        root: join('uploads', 'posts'),
      });
    } catch (err) {
      throw new NotFoundException('File Not Found');
    }
  }
}
