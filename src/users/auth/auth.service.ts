import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import * as bcrypt from 'bcrypt';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user.entity';
import { NotFoundError } from 'rxjs';
import { UsersService } from '../users.service';
import { JwtService } from '@nestjs/jwt';
import { use } from 'passport';
@Injectable()
export class AuthService {

    constructor(private readonly usersService: UsersService,
         @InjectRepository(User)private readonly userRepo:Repository<User>,private readonly jwtService:JwtService){}

    async register(createuserdto:CreateUserDto){
        const userexist=await this.userRepo.find({email:createuserdto.email})|| []
        if(userexist.length) throw new BadRequestException('User with this email already exists');
        createuserdto.password=await this.hash(createuserdto.password);
        const user=await this.usersService.create(createuserdto);
        return {user:user,jwt: await this.jwtService.sign({sub:user.id})};


    }

    async hash(password: CreateUserDto['password']){
        const salt = await bcrypt.genSalt(10)
        password = `${salt}|${await bcrypt.hash(password, salt)}`
        return password
    }

    async dehash(password: CreateUserDto['password'], input_password: string){
        const [salt, hash] = password.split("|")
        input_password = await bcrypt.hashSync(input_password, salt)
        if(input_password !== hash) throw new UnauthorizedException('incorrect password')
    }

    async login(email:CreateUserDto['email'],password:CreateUserDto['password']){
        const [userexist]=await this.userRepo.find({email})|| []
        if(!userexist) throw new NotFoundException('User with this email does not exist');
        const [salt, hash] = userexist.password.split('|')
        const pass=bcrypt.hashSync(password,salt);
        if(pass!==hash) throw new UnauthorizedException('Wrong password');
        return {userexist:userexist,jwt: await this.jwtService.sign({sub:userexist.id})};
        
    }

}
