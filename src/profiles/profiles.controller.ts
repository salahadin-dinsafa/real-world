import { Controller, Delete, Get, Post } from '@nestjs/common';

import { ProfilesService } from './profiles.service';

@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @Get(':username')
    getProfileByUsername() { }

    @Post(':username/follow')
    followUserByUsername() { }

    @Delete(':username/follow')
    unFollowUserByUsername() { }

}
