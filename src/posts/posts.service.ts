import { Injectable, NotFoundException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
  ) {}
  create(createPostDto: CreatePostDto) {
    const post = this.postsRepository.create(createPostDto)
    return this.postsRepository.save(post);
  }

  findAll(): Promise<Post[]> {
    return this.postsRepository.find({relations:["user"]});
  }
  findMUVQ(limit:number): Promise<Post[]> {
    return this.postsRepository.find({relations:["user"],take:limit,order:{score:"DESC"}});
  }
  findRecent(limit:number): Promise<Post[]> {
    return this.postsRepository.find({relations:["user"],take:limit,order:{posted_at:"DESC"}});
  }

  findOne(id: number): Promise<Post> {
    return this.postsRepository.findOneOrFail(id,{relations:["user"]});
  }
  

  async update(UpdatePostDto:UpdatePostDto,id:number){
    try {
      const post=await this.findOne(id)
      for (const key in UpdatePostDto) {
        post[key]=UpdatePostDto[key];
        
      }
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new NotFoundException('User not found ')
    }

  }
  async remove(id: number): Promise<void> {
    await this.postsRepository.delete(id);
  }


}
