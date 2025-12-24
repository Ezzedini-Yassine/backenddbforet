import { ApiProperty } from "@nestjs/swagger";

export class TokensClass {
    @ApiProperty({
        type: 'string',
        description: 'The access token',
    })
    access_token: string;

    @ApiProperty({
        type: 'string',
        description: 'The refresh token',
      })
    refresh_token: string;
}

export type Tokens = TokensClass;