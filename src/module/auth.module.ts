import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/domain/user.entity';
import { UsersRepository } from 'src/repository/users.repository';
import { AtStrategy } from 'src/security/strategies/at.strategy';
import { RtStrategy } from 'src/security/strategies/rt.strategy';
import { AuthService } from 'src/service/auth.service';
import { AuthController } from 'src/web/rest/auth.controller';


@Module({
  imports: [
    JwtModule.register({}),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersRepository, AuthService, AtStrategy, RtStrategy ],
  controllers: [AuthController],
  exports:[AtStrategy, RtStrategy],
})
export class AuthModule {}
