import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "src/types/jwt-payload.types";

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt'){
    constructor(){
        super({
            // this "!" is new in typescript, putting it means we are sure that this value is not null or undefined
            secretOrKey: process.env.JWT_SECRET_AT!,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        });
    }

    async validate(payload: JwtPayload) {
        console.log("in guard: ", payload.userId)
        return {
            userId: payload.userId,
          };
    
    }
}