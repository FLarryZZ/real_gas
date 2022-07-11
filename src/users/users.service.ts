import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.usersRepository.find({relations:["posts","votes","votes.post","votes.post.user"]});
  }
 

  findOne(id: number): Promise<User> {
    return this.usersRepository.findOneOrFail(id,{relations:["posts","votes","votes.post","votes.post.user"]});
  }
  
  create(createUserDto: CreateUserDto) {
    const user = this.usersRepository.create(createUserDto)
    return this.usersRepository.save(user);
}
 async update(UpdateUserDto:UpdateUserDto,id:number){
    try {
      const user=await this.findOne(id)
      for (const key in UpdateUserDto) {
        user[key]=UpdateUserDto[key];
        
      }
      return await this.usersRepository.save(user);
    } catch (error) {
      throw new NotFoundException('User not found ')
    }

  }
  async remove(id: number) {
   
    await this.usersRepository.delete(id);
    return `User with an id of ${id} has been deleted`
  }
}