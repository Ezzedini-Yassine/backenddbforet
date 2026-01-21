import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreatedBy } from "src/domain/enums/createdby.enum";
import { Role } from "src/domain/enums/role.enum";
import { User } from "src/domain/user.entity";
import { transformPassword } from "src/security/password.util";
import { SignUpDTO } from "src/service/dto/auth/sign-up.dto";
import { Repository } from "typeorm";

export class UsersRepository {
    constructor(@InjectRepository(User) readonly repo: Repository<User>) {}

    async createUser(signUpDTO: SignUpDTO): Promise<User>{
        //console.log("createUserAdmin called with:", signUpDTO);
        const { email,username, password}= signUpDTO;
        const user = this.repo.create({ email, username, password, roles: Role.FREEUSER, createdBy: CreatedBy.SYSTEM});
        console.log("User entity before password transformation:", user);
        await transformPassword(user);

        try {
            return await this.repo.save(user);
        } catch (error) {
            if (error.code === '23505') {
                const userFoundByEmail: User | null = await this.repo.findOne({where: {email}});
                if(userFoundByEmail){
                    throw new ConflictException('Email is already in use');
                }
                const userFoundByUsername: User | null = await this.repo.findOne({where: {username}});
                if(userFoundByUsername){
                    throw new ConflictException('Username is already in use');
                }
                //handle edge cases in the future in case a developer adds 
                throw new ConflictException('Duplicate entry detected');
            } else {
                console.error('[UsersRepository] createUser failed', {
        message: error.message,
        code: error.code,
        detail: error.detail,
        hint: error.hint,
        query: error.query,           // ← very useful
        parameters: error.parameters, // ← very useful
        stack: error.stack?.substring(0, 800), // prevent flooding logs
    });
                throw new InternalServerErrorException();
            }
        }
    }
}