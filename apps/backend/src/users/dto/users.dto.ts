import { IsEmail, IsNotEmpty, IsOptional, IsUUID, MinLength, IsEnum } from 'class-validator';
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

  @ApiProperty({ example: 'tenant-id-123' })
  @IsUUID()
  @IsNotEmpty()
  tenantId: string;
}

export class UpdateUserDto {
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
}

export class UserResponseDto {
  @ApiProperty({ example: 'user-id-123' })
  id: string;

  @ApiProperty({ example: 'user@example.com' })
  email: string;

  @ApiProperty({ example: 'Owner', enum: UserRole })
  role: UserRole;

  @ApiProperty({ example: 'tenant-id-123' })
  tenantId: string;

  @ApiProperty()
  createdAt: Date;
}