import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { CommentService } from './comment.service';

@Module({
  controllers: [PostController],
  providers: [PostService, CommentService],
})
export class PostModule {}
