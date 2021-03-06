import { Post } from "src/posts/entities/post.entity";
import { Vote } from "src/votes/votes.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({nullable: false})
    first_name: string

    @Column({nullable: false})
    last_name: string

    @Column({nullable: false, unique: true})
    email: string

    @Column({nullable: false})
    password: string

    @Column({default: 'http://localhost:8000/users/uploads/default.png'})
    avatar: string

    @OneToMany(() => Post, post => post.user)
    posts: Post[]

    @OneToMany(() => Vote, vote => vote.user)
    votes: Vote[]
    
    get author(){
        return `${this.first_name} ${this.last_name}`
    }
}
