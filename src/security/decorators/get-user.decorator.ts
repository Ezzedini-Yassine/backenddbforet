import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "src/domain/user.entity";
import { JwtPayloadWithRt } from "src/types/jwt-payload-with-rt.types";

export const GetUser = createParamDecorator((data: keyof JwtPayloadWithRt | undefined, ctx: ExecutionContext): User => {
    const req = ctx.switchToHttp().getRequest();
    if(!data) return req.user;
    console.log("the user object in the request: ", req.user);
    return req.user[data];
})