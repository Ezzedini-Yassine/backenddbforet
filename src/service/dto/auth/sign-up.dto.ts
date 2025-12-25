import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDTO {
  @ApiProperty({
    example: 'yacine@example.com',
    description: 'Unique email address for account identity',
  })
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    example: 'yacine_dev',
    description: 'Public display name (Maximum 30 characters)',
  })
  @IsString()
  @IsNotEmpty()
  @MinLength(3) // Added a minimum to prevent 1-character usernames
  @MaxLength(30)
  username: string;

  @ApiProperty({
    example: 'Forest#2025!',
    format: 'password', // Visual cue for Swagger UI
    description: 'Password must be 8-30 characters with uppercase, lowercase, and a number or special character',
  })
  @IsString()
  @MinLength(8, { message: 'Password is too short (minimum 8 characters)' })
  @MaxLength(30, { message: 'Password is too long (maximum 30 characters)' }) // Fixed consistency
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number or special character',
  })
  password: string;
}