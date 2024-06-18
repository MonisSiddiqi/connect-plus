import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Injectable()
export class FollowingService {
  constructor(private readonly prismaService: PrismaService) {}

  async myFollowing(authUser: User) {
    //get followed pages
    const followers: unknown[] = await this.prismaService.follower.findMany({
      where: {
        userId: authUser.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return new ApiResponse(followers);
  }
}
