import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm/dist/common/typeorm.decorators';
import { JwtService } from '@nestjs/jwt/dist/jwt.service';
import { Repository } from 'typeorm';
import { hash, compare } from 'bcryptjs';

import { UserEntity } from './entities/user.entity';
import { CreateUserType } from './types/create-user.type';
import { LoginType } from './types/login.type';
import { Payload } from './types/payload.type';
import { UpdateUserType } from './types/update-user.type';
import { User } from './types/user.type';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly jwtService: JwtService
    ) { }



    async getUserByUsernameWithRelation(username: string): Promise<UserEntity> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { username }, relations: ['follower'] });
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!user) throw new UnauthorizedException(`User with #username: ${username} not found`)
        return user;
    }
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
    async createUser(createUser: CreateUserType): Promise<User> {
        const { user } = createUser;
        try {
            const newUser = this.userRepository.create({
                ...user,
                password: await hash(user.password, 15)
            })
            return this.getCurrentUser(await this.userRepository.save(newUser))
        } catch (error) {
            if (error.code === '23505')
                throw new UnprocessableEntityException(`user with #username: ${user.username} already exists`)
            throw new UnprocessableEntityException(`${error.message}`)

        }
    }

    async login(login: LoginType): Promise<User> {
        let user: UserEntity;
        try {
            user = await this.userRepository.findOne({ where: { email: login.user.email } });
        }
        catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
        if (!user) throw new UnauthorizedException('User not authorized');
        const isValidPassword: boolean = await compare(login.user.password, user.password);
        if (!isValidPassword) throw new UnauthorizedException('User not authorized');

        return this.getCurrentUser(user);

    }

    async getCurrentUser(user: UserEntity): Promise<User> {
        const payload: Payload = { username: user.username };
        try {
            const token: string =
                this.jwtService.sign(payload, { secret: process.env.JWT_SECRET })
            delete user.password;
            delete user.id;
            return {
                user: {
                    ...user, token
                }
            };

        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)
        }
    }

    async updateCurrentUser(currentUser: UserEntity, updateUser: UpdateUserType): Promise<User> {
        const { user } = updateUser;
        try {
            user.password ?
                Object.assign(currentUser, { ...user, password: await hash(user.password, 15) }) :
                Object.assign(currentUser, { ...user });

            return this.getCurrentUser(await this.userRepository.save(currentUser));
        } catch (error) {
            throw new UnprocessableEntityException(`${error.message}`)

        }
    }
}
