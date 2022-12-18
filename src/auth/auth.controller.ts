import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './types/user.type';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }


    @Post('/users/login')
    login(@Body() loginDto: LoginDto): Promise<User> {
        return this.authService.login(loginDto);
    }


    @Post('/users')
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard())
    @Get('/user')
    getCurrentUser(@GetUser() user: UserEntity): Promise<User> {
        return this.authService.getCurrentUser(user);
    }

    @UseGuards(AuthGuard())
    @Put('/user')
    updateCurrentUser(
        @GetUser() user: UserEntity,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.authService.updateCurrentUser(user, updateUserDto);
    }

}
