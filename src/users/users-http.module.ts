import { Module } from '@nestjs/common';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from './auth/auth.service';

@Module({
  imports: [UsersModule],
  providers: [UsersService, AuthService],
  controllers: [UsersController]
})
export class UserHttpModule {}
