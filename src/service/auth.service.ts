import { UsersRepository } from "src/repository/users.repository";
import { SignUpDTO } from "./dto/auth/sign-up.dto";
import { Tokens } from "src/types/tokens.type";
import { User } from "src/domain/user.entity";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { SignInDTO } from "./dto/auth/sign-in.dto";

@Injectable()
export class AuthService {

    constructor(
        private usersRepository: UsersRepository,
        private jwtService: JwtService,
    ){}

    async signUp(signUpDTO: SignUpDTO): Promise<Tokens> {
        const user: User = await this.usersRepository.createUser(signUpDTO);
        const tokens = await this.getTokens(user.id)
        await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
        return tokens;    
    }

    async signIn(signInDTO: SignInDTO): Promise<Tokens> {
        const { email, password} = signInDTO;
        const user = await this.usersRepository.repo.findOne({where: { email }});

        if(user && (await bcrypt.compare(password, user.password))){
            const tokens = await this.getTokens(user.id)
            await this.updateRefreshTokenHash(user.id, tokens.refresh_token);
            return tokens;
        } else {
            throw new UnauthorizedException('Please check your login credentials');
        }
    }

    async getTokens(userId: string): Promise<Tokens>{
        const [at, rt] = await Promise.all([
            this.jwtService.sign({userId}, {secret: process.env.JWT_SECRET_AT, expiresIn: 60 * 15}),
            this.jwtService.sign({userId}, {secret: process.env.JWT_SECRET_RT, expiresIn: 60 * 60 * 24 * 7})
        ]);

        return {
            access_token: at,
            refresh_token: rt
        };
    }

    async updateRefreshTokenHash(userId: string, rt: string){
        const hashedRt = await bcrypt.hash(rt, 10);
        const myUser: User | undefined = await this.usersRepository.repo.preload({id: userId, refreshToken: hashedRt});
        if (!myUser) {
        throw new NotFoundException(`User with ID ${userId} not found`);
        }
        await this.usersRepository.repo.save(myUser);

    }

}