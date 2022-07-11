import { IsString,IsNumber, MaxLength, MinLength, IsNotEmpty } from "class-validator";
import { User } from "src/users/user.entity";

export class CreatePostDto {
    
    @IsString()
    content: string

    @IsNotEmpty()
    @IsNumber()
    user: User
   
}