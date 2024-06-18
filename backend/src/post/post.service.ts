import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma, User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { removeFile } from 'src/utils/remove-file';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Injectable()
export class PostService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
    createPostDto: CreatePostDto,
    file: Express.Multer.File,
    authUser: User,
  ) {
    const { description } = createPostDto;

    const tags = this.extractTags(description);

    //uploading post
    let post;
    if (file) {
      post = await this.prismaService.post.create({
        data: {
          file: file.path,
          description,
          userId: authUser.id,
        },
      });
    } else {
      post = await this.prismaService.post.create({
        data: {
          description,
          userId: authUser.id,
        },
      });
    }

    //adding the tags
    for (let i = 0; i < tags.length; i++) {
      let tag = await this.prismaService.tag.findUnique({
        where: {
          name: tags[i].tag,
        },
      });
      if (!tag) {
        tag = await this.prismaService.tag.create({
          data: {
            name: tags[i].tag,
          },
        });
      }
      await this.prismaService.postTag.create({
        data: {
          postId: post.id,
          tagId: tag.id,
        },
      });
    }

    return new ApiResponse(post, 'Post Uploaded Successfully');
  }

  async findOne(id: string, authUser: User) {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            isActive: true,
            role: true,
            updatedAt: true,
            createdAt: true,
            UserProfile: true,
          },
        },
        PostTag: {
          include: {
            tag: true,
          },
        },
        PostLike: true,
      },
    });
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    return new ApiResponse(post);
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  async remove(id: string, authUser: User) {
    //is Post exist
    const post = await this.prismaService.post.findFirst({
      where: {
        id,
        userId: authUser.id,
      },
    });
    if (!post) {
      throw new UnprocessableEntityException('Post not found');
    }
    //deleting Post file
    if (post.file) removeFile(post.file);
    //Todo: remove orphan tags
    //deleting the Post
    const deletedPost = await this.prismaService.post.delete({
      where: {
        id,
      },
    });
    return new ApiResponse(deletedPost, 'Post Deleted Successfully');
  }

  /*Like Post*/
  async likePost(id: string, authUser: User) {
    //is Post Exist
    const post = await this.prismaService.post.findFirst({
      where: {
        id,
        NOT: {
          userId: authUser.id,
        },
      },
    });
    if (!post) {
      throw new UnprocessableEntityException('Post not found');
    }
    //if already liked then unlike the Post else like the Post
    const postLike = await this.prismaService.postLike.findFirst({
      where: {
        userId: authUser.id,
        postId: id,
      },
    });

    if (postLike) {
      const postLike = await this.prismaService.postLike.delete({
        where: {
          postId_userId: {
            postId: id,
            userId: authUser.id,
          },
        },
      });
      return new ApiResponse(postLike, 'Post unlike successfully');
    } else {
      const postUnlike = await this.prismaService.postLike.create({
        data: {
          userId: authUser.id,
          postId: id,
        },
      });
      return new ApiResponse(postUnlike, 'Post liked successfully');
    }
  }

  async viewPost(id: string, authUser: User) {
    //is Post exist
    const post = await this.prismaService.post.findFirst({
      where: {
        id,
      },
      include: {
        user: true,
      },
    });
    if (!post) {
      throw new UnprocessableEntityException('Post not found');
    }
    //user can only view its own Post onces, checking is the Post related to the user's page.
    const isMatch = await this.prismaService.post.findFirst({
      where: {
        userId: authUser.id,
      },
    });
    if (isMatch) {
      //is already viewed
      const PostView = await this.prismaService.postView.findFirst({
        where: {
          userId: authUser.id,
          postId: post.id,
        },
      });
      if (PostView) {
        throw new UnprocessableEntityException(
          'User can view own Post only once',
        );
      } else {
        const PostView = await this.prismaService.postView.create({
          data: {
            userId: authUser.id,
            postId: post.id,
          },
        });
        return new ApiResponse(PostView, 'Post view added');
      }
    }

    //adding view for other users
    const PostView = await this.prismaService.postView.create({
      data: {
        userId: authUser.id,
        postId: post.id,
      },
    });

    return new ApiResponse(PostView, 'Post view added');
  }

  /*Get feed Posts*/
  async getFeedPosts(page: number, authUser: User) {
    const orderBy: Prisma.PostOrderByWithRelationInput = {
      createdAt: 'desc',
    };
    const limit = 5;
    if (!page || page < 1) {
      page = 1;
    }
    const posts = await this.prismaService.post.findMany({
      where: {
        NOT: {
          userId: authUser.id,
        },
      },
      orderBy,
      include: {
        _count: {
          select: {
            PostLike: true,
            PostView: true,
            Comment: true,
          },
        },
        user: {
          select: {
            id: true,
            email: true,
            mobile: true,
            isActive: true,
            role: true,
            updatedAt: true,
            createdAt: true,
            UserProfile: true,
          },
        },
        PostTag: {
          include: {
            tag: true,
          },
        },
        PostLike: true,
      },
      skip: (page - 1) * limit,
      take: limit,
    });
    return new ApiResponse(posts);
  }

  extractTags(description: string) {
    const regex = /#(\w+)/g;
    const tags = [];

    let match;
    while ((match = regex.exec(description)) !== null) {
      const tag = match[1];
      tags.push({ tag });
    }
    return tags;
  }
}
