import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { UserEntity } from '../auth/entities/user.entity';
import { ProfilesService } from './profiles.service';
import { Profile } from './types/profile.type';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @UseGuards(AuthGuard())
    @Get(':username')
    getProfileByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string): Promise<Profile> {
        return this.profilesService.getProfileByUsername(currentUsername, username);
    }

    @UseGuards(AuthGuard())
    @Post(':username/follow')
    followUserByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string,
    ): Promise<Profile> {
        return this.profilesService.followUserByUsername(currentUsername, username);
    }
    @UseGuards(AuthGuard())
    @Delete(':username/follow')
    unFollowUserByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string,
    ): Promise<Profile> {
        return this.profilesService.unFollowUserByUsername(currentUsername, username);
    }

}
