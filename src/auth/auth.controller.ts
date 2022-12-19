import { Body, Controller, Get, Post, Put, UseGuards } from '@nestjs/common';

import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { GetUser } from './decorators/get-user.decorator';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UserEntity } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './types/user.type';

@ApiTags('User and Authentication')
@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @ApiOperation({ summary: 'Existing user login', description: 'Login for existing user' })
    @ApiCreatedResponse({
        schema: {
            example: {
                user: {
                    email: 'string',
                    token: 'string',
                    username: 'string',
                    bio: 'string',
                    image: 'string',
                }
            }
        }
    })
    @Post('/users/login')
    login(@Body() loginDto: LoginDto): Promise<User> {
        return this.authService.login(loginDto);
    }

    @ApiOperation({ summary: 'Register a new user', description: 'Register a new user' })
    @ApiCreatedResponse({
        schema: {
            example: {
                user: {
                    email: 'string',
                    token: 'string',
                    username: 'string',
                    bio: 'string',
                    image: 'string',
                }
            }
        }
    })
    @Post('/users')
    createUser(@Body() createUserDto: CreateUserDto): Promise<User> {
        return this.authService.createUser(createUserDto);
    }

    @ApiOperation({ summary: 'Get current user', description: 'Gets the currently logged-in user' })
    @ApiOkResponse({
        schema: {
            example: {
                user: {
                    email: 'string',
                    token: 'string',
                    username: 'string',
                    bio: 'string',
                    image: 'string',
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Get('/user')
    getCurrentUser(@GetUser() user: UserEntity): Promise<User> {
        return this.authService.getCurrentUser(user);
    }

    @ApiOperation({ summary: 'Update current user', description: 'Updated user information for current user' })
    @ApiOkResponse({
        schema: {
            example: {
                user: {
                    email: 'string',
                    token: 'string',
                    username: 'string',
                    bio: 'string',
                    image: 'string',
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Put('/user')
    updateCurrentUser(
        @GetUser() user: UserEntity,
        @Body() updateUserDto: UpdateUserDto
    ): Promise<User> {
        return this.authService.updateCurrentUser(user, updateUserDto);
    }

}
