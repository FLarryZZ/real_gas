import { Body, Controller, Delete, Get, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { PassThrough } from 'stream';
import { AuthService } from './auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';
import { Response } from 'express';
import { CurrentUser } from './current_user.decorator';
import { User } from './user.entity';
@Controller()
export class UsersController {
    constructor(private readonly userServices: UsersService,private readonly authService:AuthService){}

    @Get('/me')
    profile(@CurrentUser()currentuser:User){
        return currentuser;
    }
    @Get('user/:id')
    allusers(@Param('id') id: number){
        return this.userServices.findOne(id);
    }
    @Get('brat')
    allusersa(){
        return this.userServices.findAll();
    }

    @Post('/register')
    async register(@Body() createuserdto:CreateUserDto, @Res({passthrough:true}) response:Response){
        const {user,jwt}=await this.authService.register(createuserdto);
        response.cookie('jwt',jwt,{httpOnly:true})
        return {user};
    }
    @Post('/logout') @UseGuards(AuthGuard('jwt'))
    async logout(@Res({passthrough:true}) response:Response){
        response.clearCookie('jwt',{httpOnly:true});
        return 'You are logged out';
    }


    @Post('/login') @UseGuards(AuthGuard('local')) 
    async login(@Body() credentials: {email:string, password: string}, @Res({passthrough:true}) response:Response){
        const {userexist,jwt}=await this.authService.login(credentials.email,credentials.password);
        response.cookie('jwt',jwt,{httpOnly:true})
        return userexist;
    }
    @Patch('me')
    async update(@Body()updateuserdto:UpdateUserDto,@CurrentUser() user: User){
        return await this.userServices.update(updateuserdto,user.id);
    }
    @Patch('/me/update-password')
    async updatePassword(@CurrentUser() user: User, @Body() {current_password, password, confirm_password}: {current_password: string,password: string, confirm_password: string}) {
      await this.authService.dehash(user.password, current_password)
      if(password === confirm_password){
        password = await this.authService.hash(password)
        return await this.userServices.update({password},user.id,);
      }
      return {msg: "passwords do not match"}
    }
    @Delete('/me/delete_account')
  remove(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt', {httpOnly: true})
    return this.userServices.remove(user.id);
  }
}
