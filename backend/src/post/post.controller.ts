import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseUUIDPipe,
  UploadedFile,
  ParseFilePipe,
  FileTypeValidator,
  Query,
  UnprocessableEntityException,
  ParseIntPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { v4 as uuidv4 } from 'uuid';
import { User } from '@prisma/client';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { CommentService } from './comment.service';
import { isUUID } from 'class-validator';

@Controller('post')
export class PostController {
  constructor(
    private readonly PostService: PostService,
    private readonly commentService: CommentService,
  ) {}

  /*Comment routes*/
  @Post('comment/:id')
  addComment(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() addCommentDto: AddCommentDto,
    @GetUser() authUser: User,
  ) {
    return this.commentService.addComment(id, addCommentDto, authUser);
  }

  @Patch('comment/:commentId')
  updateComment(
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @GetUser() authUser: User,
  ) {
    return this.commentService.updateComment(
      commentId,
      updateCommentDto,
      authUser,
    );
  }

  @Delete('comment/:commentId')
  deleteComment(
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @GetUser() authUser: User,
  ) {
    return this.commentService.deleteComment(commentId, authUser);
  }

  @Get('comment/:postId')
  getCommentsByPostId(
    @Param('postId', new ParseUUIDPipe()) postId: string,
    @GetUser() authUser: User,
  ) {
    return this.commentService.getCommentsByPostId(postId, authUser);
  }

  @Post('comment/like/:commentId')
  likeComment(
    @Param('commentId', new ParseUUIDPipe()) commentId: string,
    @GetUser() authUser: User,
  ) {
    return this.commentService.likeComment(commentId, authUser);
  }

  /*Post routes*/
  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: join('uploads', 'posts'),
        filename: (_, file, cb) => {
          const filename = uuidv4();
          cb(null, `${filename}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  uploadPost(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [new FileTypeValidator({ fileType: 'image' })],
      }),
    )
    file: Express.Multer.File,
    @GetUser() authUser: User,
  ) {
    return this.PostService.create(createPostDto, file, authUser);
  }

  @Get('feed')
  getFeedPosts(
    @Query(
      'page',
      new ParseIntPipe({
        optional: true,
      }),
    )
    page: number,
    @GetUser() authUser: User,
  ) {
    return this.PostService.getFeedPosts(page, authUser);
  }

  @Get(':id')
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() authUser: User,
  ) {
    return this.PostService.findOne(id, authUser);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.PostService.update(+id, updatePostDto);
  }

  @Delete(':id')
  deletePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() authUser: User,
  ) {
    return this.PostService.remove(id, authUser);
  }

  @Post('like/:id')
  likePost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() authUser: User,
  ) {
    return this.PostService.likePost(id, authUser);
  }

  @Post('view/:id')
  viewPost(
    @Param('id', new ParseUUIDPipe()) id: string,
    @GetUser() authUser: User,
  ) {
    return this.PostService.viewPost(id, authUser);
  }
}
