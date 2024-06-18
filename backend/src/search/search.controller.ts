import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  findAll(@Query('text') text: string, @GetUser() authUser: User) {
    return this.searchService.findAllPost(text, authUser);
  }
}
