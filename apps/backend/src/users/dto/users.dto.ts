import { IsEmail, IsString, IsNotEmpty, IsOptional, IsUUID, MinLength, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
  OWNER = 'owner',
  USER = 'user',
}

export class CreateUserDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ example: 'strongpassword' })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'agent', enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

}

export class FindOrCreateUserDto {
    @ApiProperty({ example: 'user@example.com' })
    @IsEmail()
    email: string;
  
    @ApiProperty({ example: 'John Doe', required: false })
    @IsString()
    @IsOptional()
    name?: string;
  
    @ApiProperty({ example: '1234567890-google', required: false })
    @IsString()
    @IsOptional()
    googleId?: string;
  
    @ApiProperty({ example: '987654321-github', required: false })
    @IsString()
    @IsOptional()
    githubId?: string;
  
    @ApiProperty({ example: 'apple-user-xyz', required: false })
    @IsString()
    @IsOptional()
    appleId?: string;
  
    @ApiProperty({ example: 'microsoft-user-abc', required: false })
    @IsString()
    @IsOptional()
    microsoftId?: string;
  
    @ApiProperty({ example: 'discord-user-123', required: false })
    @IsString()
    @IsOptional()
    discordId?: string;
  }
export class UpdateUserDto {
  @ApiProperty({ example: 'user-id-123' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'updatedemail@example.com', required: false })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'newpassword123', required: false })
  @IsOptional()
  @MinLength(6)
  password?: string;

  @ApiProperty({ example: 'owner', enum: UserRole, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  //is 2fa enabled
  @ApiProperty({ example: true, required: false })
  @IsOptional()
  isTwoFactorEnabled?: boolean;

  //2fa secret
  @ApiProperty({ example: 'your-otp-secret', required: false })
  @IsOptional()
  twoFactorSecret?: string | null;
}

export class UserResponseDto {
  @ApiProperty({ example: 'user-id-123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

 //tenants is an array of tenant ids
  @ApiProperty({ example: ['tenant-id-123'], required: false })
  @IsOptional()
  tenants?: string[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ example: 'your-otp-secret', required: false })
  @IsOptional()
  twoFactorSecret?: string;

}