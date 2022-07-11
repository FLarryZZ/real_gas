import { PartialType } from '@nestjs/mapped-types';
import { Exclude } from 'class-transformer';
import { IsEmpty } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
//test1dsadas
export class UpdateUserDto extends PartialType(CreateUserDto) {

    @Exclude()
    password:string


}
