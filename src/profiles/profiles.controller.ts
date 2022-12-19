import { Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger/dist';

import { GetUser } from '../auth/decorators/get-user.decorator';
import { ProfilesService } from './profiles.service';
import { Profile } from './types/profile.type';

@ApiTags('Profile')
@Controller('profiles')
export class ProfilesController {
    constructor(private readonly profilesService: ProfilesService) { }

    @ApiOperation({ summary: 'Get a profile', description: 'Get a profile of a user of the system. Auth optional' })
    @ApiOkResponse({
        schema: {
            example: {
                profile: {
                    bio: 'string',
                    following: 'boolean',
                    image: 'string',
                    username: 'string',
                }
            }
        }
    })
    @Get(':username')
    getProfileByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string): Promise<Profile> {
        return this.profilesService.getProfileByUsername(currentUsername, username);
    }

    @ApiOperation({ summary: 'Follow a user', description: 'Follow a user by usrename' })
    @ApiCreatedResponse({
        schema: {
            example: {
                profile: {
                    bio: 'string',
                    following: 'boolean',
                    image: 'string',
                    username: 'string',
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Post(':username/follow')
    followUserByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string,
    ): Promise<Profile> {
        return this.profilesService.followUserByUsername(currentUsername, username);
    }

    @ApiOperation({ summary: 'Unfollow a user', description: 'unfollow a user by username' })
    @ApiOkResponse({
        schema: {
            example: {
                profile: {
                    bio: 'string',
                    following: 'boolean',
                    image: 'string',
                    username: 'string',
                }
            }
        }
    })
    @UseGuards(AuthGuard())
    @Delete(':username/follow')
    unFollowUserByUsername(
        @GetUser('username') currentUsername: string,
        @Param('username') username: string,
    ): Promise<Profile> {
        return this.profilesService.unFollowUserByUsername(currentUsername, username);
    }

}
