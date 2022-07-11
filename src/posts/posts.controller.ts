import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ForbiddenException, Query } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { CurrentUser } from 'src/users/current_user.decorator';
import { User } from 'src/users/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { VotesService } from 'src/votes/votes.service';

@Controller()
export class PostsController {
  constructor(private readonly postsService: PostsService,private readonly voteService: VotesService) {}

  @Post('me/myquote') @UseGuards(AuthGuard('jwt'))
  async create(@Body() createPostDto: Partial<CreatePostDto>,@CurrentUser()currentuser:User) {
    return this.postsService.create({content:createPostDto.content,user:currentuser});
  }

  @Get('mostupvoted/quotes') 
  findMUVQ(@Query('limit') limit: number) {
    return this.postsService.findMUVQ(limit);
  }

  @Get('mostrecent/quotes') 
  Recent(@Query('limit') limit: number) {
    return this.postsService.findRecent(limit);
  }

  @Get('quote/:id')
  findOne(@Param('id') id: number) {
    return this.postsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updatePostDto: UpdatePostDto) {
    return this.postsService.update(updatePostDto,id);
  }

  @Delete('deletequote/:id')
  remove(@Param('id') id: number) {
    return this.postsService.remove(id);
  }

  @Post(':id/upvote') @UseGuards(AuthGuard('jwt'))
  async upvote(@Param('id') id: number,@CurrentUser()currentuser:User) {
    const {user} = await this.postsService.findOne(id)
   if(currentuser.id===user.id){
     throw new ForbiddenException("You can not like your own post cunt")
   }
   else {
    const post=await this.postsService.findOne(id);
    return this.voteService.vote(currentuser,post,true)
   }
    
  }

  @Post(':id/downvote')
  async downvote(@Param('id') id: number,@CurrentUser()currentuser:User) {
    const {user} = await this.postsService.findOne(id)
   if(currentuser.id===user.id){
     throw new ForbiddenException("You can not like your own post cunt")
   }
   else {
    const post=await this.postsService.findOne(id);
    return this.voteService.vote(currentuser,post,false)
   }
  }
}
