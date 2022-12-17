import { createParamDecorator } from "@nestjs/common/decorators/http/create-route-param-metadata.decorator";
import { ExecutionContext } from "@nestjs/common/interfaces/features/execution-context.interface";
import { Request } from 'express';

export const GetUser = createParamDecorator((data: any, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const { user } = request;
    if (!user) return null;
    if (data) return user[data];
    return user;
})