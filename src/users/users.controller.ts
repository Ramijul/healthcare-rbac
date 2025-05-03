import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { LoginDto, UserResponseDto } from './users.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    const users = await this.usersService.findAll();
    return users.map((user) => new UserResponseDto(user));
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.usersService.validateUser(
      loginDto.username,
      loginDto.password,
    );
    return this.usersService.generateToken(user.id, user.role);
  }
}
