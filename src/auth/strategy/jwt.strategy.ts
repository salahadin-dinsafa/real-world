import { Injectable } from "@nestjs/common/decorators/core/injectable.decorator";

import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";

import { UserEntity } from "../entities/user.entity";
import { Payload } from "../types/payload.type";
import { AuthService } from "../auth.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET
        });
    }

    async validate(payload: Payload): Promise<UserEntity> {
        const user: UserEntity =
            await this.authService.getUserByUsername(payload.username);
        return user;
    }
}