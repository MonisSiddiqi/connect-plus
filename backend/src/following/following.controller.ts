import { Controller, Get, } from '@nestjs/common';
import { FollowingService } from './following.service';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from '@prisma/client';


@Controller('following')
export class FollowingController {
  constructor(private readonly followingService: FollowingService) { }

  @Get()
  myFollowing(@GetUser() authUser: User) {
    return this.followingService.myFollowing(authUser);
  }


}
