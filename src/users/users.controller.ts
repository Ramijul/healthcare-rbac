import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserResponseDto } from './users.dto';
import { Public } from './auth/decorators/public.decorator';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }
}
