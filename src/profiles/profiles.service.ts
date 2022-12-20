import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';

import { AuthService } from '../auth/auth.service';
import { UserEntity } from '../auth/entities/user.entity';
import { Profile } from './types/profile.type';

@Injectable()
export class ProfilesService {
    constructor(
        private readonly authService: AuthService,
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>
    ) { }

    async getProfileByUsername(currentUser: UserEntity, username: string): Promise<Profile> {
        let user: UserEntity = await this.authService.getUserByUsernameWithRelationFollower(username);
        let currentUsername: string;
        currentUser ? currentUsername = currentUser.username : currentUsername = '';
        return await this.getProfile(currentUsername, user);
    }

    async followUserByUsername(currentUsername: string, username: string): Promise<Profile> {
        if (currentUsername === username)
            throw new UnprocessableEntityException('Can\'t follow your self');
        let currentUser: UserEntity =
            await this.authService.getUserByUsernameWithRelationFollowing(currentUsername)
        let user: UserEntity =
            await this.authService.getUserByUsernameWithRelationFollower(username);

        currentUser.following = [...currentUser.following, user];
        user.follower = [...user.follower, currentUser];
        await this.userRepository.save(currentUser);
        return await this.getProfile(currentUsername, await this.userRepository.save(user));
    }
    async unFollowUserByUsername(currentUsername: string, username: string): Promise<Profile> {
        if (currentUsername === username)
            throw new UnprocessableEntityException('Can\'t unfollow your self');
        let currentUser: UserEntity =
            await this.authService.getUserByUsernameWithRelationFollowing(currentUsername);
        let user: UserEntity =
            await this.authService.getUserByUsernameWithRelationFollower(username);

        currentUser.following =
            currentUser.following.filter(followingUser => followingUser.username !== user.username);
        user.follower =
            user.follower.filter(followerUser => followerUser.username !== currentUsername);

        await this.userRepository.save(currentUser);
        return await this.getProfile(currentUsername, await this.userRepository.save(user));
    }

    async getProfile(currentUsername: string, user: UserEntity): Promise<Profile> {
        let following: boolean = false;

        try {
            if (user.follower) {
                user.follower.find(user => user.username === currentUsername) ?
                    following = true :
                    following = false;
                delete user.following;
            } else {
                user =
                    await this.authService.getUserByUsernameWithRelationFollower(user.username);
                user.follower.find(user => user.username === currentUsername) ?
                    following = true :
                    following = false;
                delete user.following;
            }
            delete user.id;
            delete user.password;
            delete user.email;
            user.follower ? delete user.follower : null;
            return {
                profile: {
                    ...user,
                    following
                }
            };
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`);
        }
    }
}
