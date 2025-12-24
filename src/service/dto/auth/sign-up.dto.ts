import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDTO {
    @ApiProperty({
        type: 'string',
        description: 'Must be an email'
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        type: 'string',
        description: 'Must be lesser than 30 characters'
    })
    @IsString()
    @MaxLength(30)
    username: string;

    @ApiProperty({
        type: 'string',
        description: 'Must be > 8 characters and < 30 + upper case + min case + special character'
    })
    @IsString()
    @MinLength(8)
    @MaxLength(20)
    @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'Password is too weak'})
    password: string;
}