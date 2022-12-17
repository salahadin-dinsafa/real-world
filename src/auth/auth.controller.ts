import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { AccessToken } from './types/access-token.type';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/users/login')
    login(@Body() loginDto: LoginDto): Promise<AccessToken> {
        return this.authService.login(loginDto);
    }

    @Post('/users')
    createUser(@Body() createUserDto: CreateUserDto): Promise<UserEntity> {
        return this.authService.createUser(createUserDto);
    }

    @UseGuards(AuthGuard())
    @Get('/user')
    getCurrentUser(@GetUser() user: UserEntity): UserEntity {
        return user;
    }

    @UseGuards(AuthGuard())
    @Put('/user')
    updateCurrentUser(
        @GetUser() user: UserEntity,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<UserEntity> {
        return this.authService.updateCurrentUser(user, updateUserDto);
    }

}
