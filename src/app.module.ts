import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from './users/user.entity';
import { Post } from "src/posts/entities/post.entity";
import { UsersModule } from './users/users.module';
import { PostsController } from './posts/posts.controller';
import { Vote } from './votes/votes.entity';
import { PostsModule } from './posts/posts.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './users/auth/auth.service';
import { UsersService } from './users/users.service';

@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true, envFilePath: '.env'}),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        type: 'postgres',
        host: config.get('HOST'),
        port: Number(config.get('PGPORT')),
        username: config.get('PGUSERNAME'),
        password: config.get('PGPASSWORD'),
        database: config.get('PGDATABASE'),
        entities:[User,Post,Vote],
        synchronize: true
      }),
      
    }),
    UsersModule,
    PostsModule,
  ],
  controllers: [AppController],
  providers: [AppService, AuthService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}

