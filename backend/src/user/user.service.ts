import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { ApiResponse } from 'src/common/dto/api-response.dto';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  /*Auth User Service*/
  async getOwnProfile(authUser: User) {
    const user = await this.prismaService.user.findFirst({
      where: {
        id: authUser.id,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        updatedAt: true,
        createdAt: true,
        UserProfile: true,
      },
    });
    return new ApiResponse(user);
  }
}
