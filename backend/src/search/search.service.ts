import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { ApiResponse } from 'src/common/dto/api-response.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SearchService {
  constructor(private readonly prismaService: PrismaService) {}

  /*Find all Post*/
  async findAllPost(text: string, authUser: User) {
    const posts = await this.prismaService.post.findMany({
      where: {
        NOT: {
          userId: authUser.id,
        },
        description: {
          contains: text,
          mode: 'insensitive',
        },
      },
      include: {
        _count: {
          select: {
            PostView: true,
          },
        },
        PostTag: {
          include: {
            tag: true,
          },
        },
      },
    });
    return new ApiResponse(posts);
  }
}
