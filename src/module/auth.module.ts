import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { UsersRepository } from 'src/repository/users.repository';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/web/rest/auth.controller';


@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersRepository, AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
