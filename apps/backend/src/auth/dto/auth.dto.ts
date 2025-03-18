import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto/users.dto';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'securePassword123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'your-otp-token' })
  @IsString() 
  @IsOptional()
  twoFactorCode?: string;
}

export class SignUpDto extends CreateUserDto {
    @ApiProperty({ example: 'your-first-name' })
    @IsString()
    @IsOptional()
    firstName?: string;

    @ApiProperty({ example: 'your-last-name' })
    @IsString()
    @IsOptional()
    lastName?: string;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'your-refresh-token' })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'your-access-token' })
  accessToken: string;

  @ApiProperty({ example: 'your-refresh-token' })
  refreshToken: string;
}

export class Enable2FADto {
    @ApiProperty({ example: 'your-otp-secret' })
    @IsString()
    @IsNotEmpty()
    secret: string;
  }
  
export class Verify2FADto {
    @ApiProperty({ example: '123456' })
    @IsString()
    @IsNotEmpty()
    token: string;

    @ApiProperty({ example: 'your-user-id' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class ResetPasswordDto {
    @ApiProperty({ example: 'your-new-password' })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: 'your-reset-token' })
    @IsString()
    @IsNotEmpty()
    resetToken: string;
}

export class ForgotPasswordDto {
    @ApiProperty({ example: 'emailAddress' })
    @IsEmail()
    @IsNotEmpty()
    email: string;
}

export class ChangePasswordDto {
    @ApiProperty({ example: 'your-old-password' })
    @IsString()
    @IsNotEmpty()
    oldPassword: string;

    @ApiProperty({ example: 'your-new-password' })
    @IsString()
    @IsNotEmpty()
    password: string;
}

export class enableTwoFactorAuth {
    @ApiProperty({ example: 'your-user-id' })
    @IsString()
    @IsNotEmpty()
    userId: string;
}

export class disableTwoFactorAuth {
    @ApiProperty({ example: 'your-user-id' })
    @IsString()
    @IsNotEmpty()
    userId: string;

    @ApiProperty({ example: 'your-otp-secret' })
    @IsString()
    @IsNotEmpty()
    secret: string;
}

