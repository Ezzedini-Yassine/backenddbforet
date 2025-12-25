import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignInDTO {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The registered email address of the user',
  })
  @IsEmail({}, { message: 'Invalid email format' })
  email: string;

  @ApiProperty({
    example: 'Password123!',
    format: 'password', // Hides characters in Swagger UI
    description: 'Min 8, Max 30 chars, must include uppercase, lowercase, and a number/special char',
  })
  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @MaxLength(30, { message: 'Password cannot exceed 30 characters' })
  // Improved Regex for Uppercase, Lowercase, and (Number OR Special Char)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain uppercase, lowercase, and a number or special character',
  })
  password: string;
}