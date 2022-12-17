import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import { UserEntity } from './entities/user.entity';
import { CreateUserType } from './types/create-user.type';
import { LoginType } from './types/login.type';
import { Payload } from './types/payload.type';
import { AccessToken } from './types/access-token.type';
import { UpdateUserType } from './types/update-user.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }

    async getUserByUsername(username: string): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { username } });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!user) throw new UnauthorizedException(`User with #username: ${username} not found`)
        return user;
    }
    async createUser(createUser: CreateUserType): Promise<UserEntity> {
        try {
            const user = this.userRepository.create({
                ...createUser,
                password: await hash(createUser.password, 15)
            })
            return await this.userRepository.save(user);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async login(login: LoginType): Promise<AccessToken> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { email: login.email } });
        }
        catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!user) throw new UnauthorizedException('User not authorized');
        const isValidPassword: boolean = await compare(login.password, user.password);
        if (!isValidPassword) throw new UnauthorizedException('User not authorized');

        const payload: Payload = { username: user.username };
        let accessToken: AccessToken;
        try {
            accessToken = {
                accessToken: this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
            };

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        return accessToken;

    }

    async updateCurrentUser(user: UserEntity, updateUser: UpdateUserType): Promise<UserEntity> {
        const { password } = updateUser;
        try {
            password ?
                Object.assign(user, { ...updateUser, password: await hash(password, 15) }) :
                Object.assign(user, { ...updateUser });

            return await this.userRepository.save(user);
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)

        }
    }
}
