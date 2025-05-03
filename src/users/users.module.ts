import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { User } from './users.entity';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth/guards/auth.guard';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    DatabaseModule.forFeature([User]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '15m' },
      }),
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // enable app-wide auth guard
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
