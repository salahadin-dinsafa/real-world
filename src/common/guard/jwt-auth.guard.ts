import { Injectable, ExecutionContext } from "@nestjs/common";

import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {


    handleRequest<TUser = any>(_err: any, user: any, _info: any, _context: ExecutionContext, _status?: any): TUser {
        return user;
    }
}
