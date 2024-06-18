import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { AddCommentDto } from './dto/add-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService) {}

  /*Add Comment*/
  async addComment(id: string, addCommentDto: AddCommentDto, authUser: User) {
    const { content } = addCommentDto;
    //is Post exist
    const Post = await this.prismaService.post.findFirst({
      where: {
        id,
      },
    });
    if (!Post) {
      throw new UnprocessableEntityException('Post not found');
    }
    //adding comment to the Post
    const comment = await this.prismaService.comment.create({
      data: {
        content,
        userId: authUser.id,
        postId: id,
      },
    });
    return new ApiResponse(comment, 'Comment Added Successfully');
  }

  /*Update Comment*/
  async updateComment(
    commentId: string,
    updateCommentDto: UpdateCommentDto,
    authUser: User,
  ) {
    const { content } = updateCommentDto;
    //is comment exist
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        userId: authUser.id,
      },
    });
    if (!comment) {
      throw new UnprocessableEntityException('Comment not found');
    }
    //updating the comment
    const updatedComment = await this.prismaService.comment.update({
      where: {
        id: commentId,
      },
      data: {
        content,
      },
    });
    return new ApiResponse(updatedComment, 'Comment updated successfully');
  }

  /*Delete Comment*/
  async deleteComment(commentId: string, authUser: User) {
    //is comment exist
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
        userId: authUser.id,
      },
    });
    if (!comment) {
      throw new UnprocessableEntityException('Comment not found');
    }
    //deleting the comment
    const deletedComment = await this.prismaService.comment.delete({
      where: {
        id: commentId,
      },
    });
    return new ApiResponse(deletedComment, 'Comment deleted successfully');
  }

  /*Like Comment*/
  async likeComment(commentId: string, authUser: User) {
    //is comment exist
    const comment = await this.prismaService.comment.findFirst({
      where: {
        id: commentId,
      },
    });
    if (!comment) {
      throw new UnprocessableEntityException('Comment not found');
    }
    //if already liked then unlike the comment else like the comment
    const likedComment = await this.prismaService.likedComment.findFirst({
      where: {
        userId: authUser.id,
        commentId,
      },
    });
    if (likedComment) {
      const likedComment = await this.prismaService.likedComment.delete({
        where: {
          userId_commentId: {
            userId: authUser.id,
            commentId,
          },
        },
      });
      return new ApiResponse(likedComment, 'Comment unlike Successfully');
    } else {
      const likedComment = await this.prismaService.likedComment.create({
        data: {
          userId: authUser.id,
          commentId,
        },
      });
      return new ApiResponse(likedComment, 'Comment liked Successfully');
    }
  }

  /*Get comments by Post id*/
  async getCommentsByPostId(postId: string, authUser: User) {
    //is Post exist
    const Post = await this.prismaService.post.findFirst({
      where: {
        id: postId,
      },
    });
    if (!Post) {
      throw new UnprocessableEntityException('Post not found');
    }
    //fetching comments of the Post
    const comments = await this.prismaService.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true,
            isActive: true,
            createdAt: true,
            updatedAt: true,
            UserProfile: true,
          },
        },
        LikedComment: {
          where: {
            userId: authUser.id,
          },
        },
        _count: {
          select: {
            LikedComment: true,
          },
        },
      },
    });
    return new ApiResponse(comments, 'Comments fetched successfully');
  }
}
