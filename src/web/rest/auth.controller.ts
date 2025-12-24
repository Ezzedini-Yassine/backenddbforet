import { Body, Controller, HttpCode, HttpStatus, Post, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { CurrentUserInterceptor } from "src/security/interceptors/current-user.interceptor";
import { AuthService } from "src/service/auth.service";
import { SignUpDTO } from "src/service/dto/auth/sign-up.dto";
import { Tokens, TokensClass } from "src/types/tokens.type";

@ApiTags('Authentication & Authorization')
@UseInterceptors(CurrentUserInterceptor)
@Controller('auth')
export class AuthController{
    constructor(private authService: AuthService){}

    @ApiOperation({ summary: 'User signup endpoint' })
    @ApiBody({ type: SignUpDTO })
    @ApiResponse({ status: 201, type: TokensClass })
    @Post('/signup')
    @HttpCode(HttpStatus.CREATED)
    signUp(@Body() signUpDTO: SignUpDTO): Promise<Tokens> {
        return this.authService.signUp(signUpDTO);
    }

}