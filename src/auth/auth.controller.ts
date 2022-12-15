import { Controller, Get, Post, Put } from '@nestjs/common';

import { AuthService } from './auth.service';

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('/users/login')
    login() { }

    @Post('/users')
    createUser() { }

    @Get('/user')
    getCurrentUser() { }

    @Put('/user')
    updateCurrentUser() { }

}
