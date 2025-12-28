import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/types/jwt-payload.types';

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_SECRET_RT!,
            passReqToCallback: true
        })
    }

    validate(req: Request, payload: JwtPayload){                             
        const refreshToken = req?.get('authorization')?.replace('Bearer', '')?.trim();
        if (!refreshToken) throw new ForbiddenException('Refresh token malformed');

        return {
            userId: payload.userId,
            refreshToken,
        }
    }
}