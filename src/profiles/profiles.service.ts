import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

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

    async getProfileByUsername(username: string): Promise<Profile> {
        let user: UserEntity = await this.authService.getUserByUsername(username);
        return this.getProfile(user);
    }

    async followUserByUsername(username: string) {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { username }, relations: ["follow"] })


        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }

        if (!user) throw new UnauthorizedException(`User not authorized`)
    }

    private getProfile(user: UserEntity): Profile {
        try {
            // todo: implement following;
            const profile: Profile = {
                username: user.username,
                bio: user.bio,
                image: user.image,
                following: false
            }
            return profile;
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`);
        }
    }
}
