import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const GetCurrentUserId = createParamDecorator((_data, ctx: ExecutionContext): string => {
    const req = ctx.switchToHttp().getRequest();
    //console.log("pewpew",req)
    //console.log('>'.repeat(10), req.user.userId)
    return req.user.userId;
})