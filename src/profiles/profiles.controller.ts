import { Controller, Delete, Get, Param, Post } from '@nestjs/common';

import { ProfilesService } from './profiles.service';
import { Profile } from './types/profile.type';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get(':username')
    // todo: get user optional
    getProfileByUsername(@Param('username') username: string): Promise<Profile> {
        return this.profilesService.getProfileByUsername(username);
    }

    @Post(':username/follow')
    followUserByUsername(@Param('username') username: string) {
        return this.profilesService.followUserByUsername(username);
     }

    @Delete(':username/follow')
    unFollowUserByUsername() { }

}
