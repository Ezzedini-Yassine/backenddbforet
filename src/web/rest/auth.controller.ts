import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { GetCurrentUserId } from "src/security/decorators/get-current-userid.decorator";
import { GetUser } from "src/security/decorators/get-user.decorator";
import { AtGuard } from "src/security/guards/at.guard";
import { RtGuard } from "src/security/guards/rt.guard";
import { CurrentUserInterceptor } from "src/security/interceptors/current-user.interceptor";
import { AuthService } from "src/service/auth.service";
import { SignInDTO } from "src/service/dto/auth/sign-in.dto";
import { SignUpDTO } from "src/service/dto/auth/sign-up.dto";
import { Tokens, TokensClass } from "src/types/tokens.type";

@ApiTags('Authentication & Authorization')
//@UseInterceptors(CurrentUserInterceptor)
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

    @ApiOperation({ summary: 'User signup endpoint' })
    @ApiBody({ type: SignInDTO })
    @ApiResponse({ status: 201, type: TokensClass })
    @Post('/signin')
    @HttpCode(HttpStatus.OK)
    signIn(@Body() signInDTO: SignInDTO): Promise<Tokens>{
        return this.authService.signIn(signInDTO);
    }

    @ApiOperation({ summary: 'User Logout endpoint, it only needs valid Token in the headers' })
    @ApiResponse({ status: 200})
    @UseGuards(AtGuard)
    @Post('/logout')
    @HttpCode(HttpStatus.OK)
    logout(@GetCurrentUserId() userId: string){
        // console.log('logout_controller'.repeat(1), userId)
        return this.authService.logout(userId);
    }

    @ApiOperation({ summary: 'Token refresh endpoint, it only requires the refresh token of the connected user' })
    @ApiResponse({ status: 201, type: TokensClass })
    @UseGuards(RtGuard)
    @Post('/refresh')
    @HttpCode(HttpStatus.OK)
    refreshTokens(@GetCurrentUserId() userId: string, @GetUser('refreshToken') refreshToken: string ): Promise<Tokens>{
        return this.authService.refreshTokens(userId, refreshToken);
    }

}