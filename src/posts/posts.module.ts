import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { Vote } from 'src/votes/votes.entity';
import { User } from 'src/users/user.entity';
import { Post } from './entities/post.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from 'src/votes/votes.service';

@Module({
  imports:[TypeOrmModule.forFeature([Post, Vote])],
  controllers: [PostsController],
  providers: [PostsService,VotesService],
  exports:[VotesService,PostsService]
})
export class PostsModule {}
