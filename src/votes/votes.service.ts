import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from 'src/posts/entities/post.entity';
import { PostsService } from 'src/posts/posts.service';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Vote } from './votes.entity';

@Injectable()
export class VotesService {
    constructor(
        @InjectRepository(Vote)
        private voteRepositry: Repository<Vote>,
        private postService: PostsService
      ) {}
    async getVote(user: User, post: Post){
        const votequery = await this.voteRepositry.createQueryBuilder("vote").innerJoinAndSelect("vote.user", "user").innerJoinAndSelect("vote.post", "post").where("post.id = :pid", {pid: post.id}).andWhere("user.id = :uid", {uid: user.id}).getOne()
        return votequery
    } 
    async delete(id: number){
        return await this.voteRepositry.delete(id)
    } 
    async update(id: number){
        const vote = await this.voteRepositry.findOne(id)
        vote.val = !vote.val
        return await this.voteRepositry.save(vote)
    }
    async vote(user:User,post:Post,value:boolean){
       const vote_exists=await this.getVote(user,post);
       if(vote_exists){
            if(vote_exists.val===value){
                return this.delete(vote_exists.id).then(() =>{
                    const score=value ? vote_exists.post.score-1:vote_exists.post.score+1
                    return this.postService.update({score},vote_exists.post.id)
                })
            }
        else {
            return this.update(vote_exists.id).then(() =>{
                const score=value ? vote_exists.post.score+2:vote_exists.post.score-2
                return this.postService.update({score},vote_exists.post.id)
            })
        }
       } 
       else{
           const new_vote= await this.voteRepositry.create({val:value,user,post})
           return this.voteRepositry.save(new_vote).then(() =>{
            const score=value ? new_vote.post.score+1:new_vote.post.score-1
            return this.postService.update({score},new_vote.post.id)
        })
       }
    }

}
