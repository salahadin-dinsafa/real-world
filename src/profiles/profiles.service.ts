import { Injectable, NotFoundException, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

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

    async getProfileByUsername(currentUsername: string, username: string): Promise<Profile> {
        let user: UserEntity = await this.authService.getUserByUsernameWithRelation(username);
        return this.getProfile(currentUsername, user);
    }

    async followUserByUsername(currentUsername: string, username: string): Promise<Profile> {
        if (currentUsername === username)
            throw new UnprocessableEntityException('Can\'t follow your self');
        let currentUser: UserEntity;
        let user: UserEntity =
            await this.authService.getUserByUsernameWithRelation(username);
        try {
            currentUser =
                await this.userRepository.findOne({ where: { username: currentUsername }, relations: ['following'] });

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }

        if (!user) throw new NotFoundException(`User with #username: ${username} not found`);
        currentUser.following = [...currentUser.following, user];
        user.follower = [...user.follower, currentUser];
        await this.userRepository.save(currentUser);
        return this.getProfile(currentUsername, await this.userRepository.save(user));
    }
    async unFollowUserByUsername(currentUsername: string, username: string): Promise<Profile> {
        if (currentUsername === username)
            throw new UnprocessableEntityException('Can\'t unfollow your self');
        let currentUser: UserEntity;
        let user: UserEntity =
            await this.authService.getUserByUsernameWithRelation(username);
        try {
            currentUser =
                await this.userRepository.findOne({ where: { username: currentUsername }, relations: ['following'] });

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }

        if (!user) throw new NotFoundException(`User with #username: ${username} not found`);
        currentUser.following =
            currentUser.following.filter(followingUser => followingUser.username !== user.username);
        user.follower =
            user.follower.filter(followerUser => followerUser.username !== currentUsername);

        await this.userRepository.save(currentUser);
        return this.getProfile(currentUsername, await this.userRepository.save(user));
    }

    private getProfile(currentUsername: string, user: UserEntity): Profile {
        let following: boolean;
        try {
            if (user.follower) {
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
