import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { PassportModule, PassportStrategy } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthService } from './auth/auth.service';
import { CurrentUserInterceptor } from './current_user.interceptor';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]),PassportModule,JwtModule.registerAsync({
    imports:[ConfigModule],
    useFactory: async(ConfigService:ConfigService)=>({
      secret: ConfigService.get('JWT')
    }),
    inject:[ConfigService]
  })],
  controllers: [UsersController],
  providers:[UsersService,AuthService,LocalStrategy,JwtStrategy,{provide:APP_INTERCEPTOR,useClass:CurrentUserInterceptor}],
  exports: [TypeOrmModule,UsersService,JwtModule],

})
export class UsersModule {}