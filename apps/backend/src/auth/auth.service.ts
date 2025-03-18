import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import * as speakeasy from 'speakeasy'; 
import * as qrcode from 'qrcode'; 
import { LoginDto, SignUpDto, disableTwoFactorAuth, RefreshTokenDto } from './dto/auth.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async validateUser (body:any) {
    const { email, password } = body;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    return
  }
  // 🔹 **Signup (Traditional Email & Password)**
  async signUp(SignUpDto: SignUpDto) {
    const { email } = SignUpDto;
    const existingUser = await this.usersService.findByEmail(email);
    if (existingUser) {
      throw new BadRequestException('Email is already in use.');
    }

    const user = await this.usersService.createUser({ ...SignUpDto });

    const tokens = this.generateJwtTokens(user);
    return { user, tokens };
  }

  // 🔹 **Login (With 2FA Support)**
  async login(data: LoginDto) {
    const { email, password, twoFactorCode } = data;
    const user = await this.usersService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    // 🔹 If 2FA is enabled, require verification
    if (user.isTwoFactorEnabled) {
      if (!twoFactorCode) {
        throw new UnauthorizedException('Two-factor authentication code is required.');
      }
      const isValid2FA = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: twoFactorCode,
      });

      if (!isValid2FA) {
        throw new UnauthorizedException('Invalid two-factor authentication code.');
      }
    }

    const tokens = this.generateJwtTokens(user);
    return { user, tokens };
  }

  // 🔹 **Generate JWT Tokens**
  generateJwtTokens(user: any) {
    const payload = { sub: user.id, email: user.email };

    return {
      accessToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: '15m',
      }),
      refreshToken: this.jwtService.sign(payload, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: '7d',
      }),
    };
  }

  // 🔹 **Enable 2FA (Generates QR Code for User)**
  async enableTwoFactorAuth(userId: string) {
    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const secret = speakeasy.generateSecret({ length: 20 }); // 🔹 Generate new secret for user
    const data = {
        id: userId,
        secret: secret.base32,
        isTwoFactorEnabled: true,
    }
    await this.usersService.updateUser(data);

    // 🔹 Generate QR Code for Google Authenticator
    const otpauthUrl = secret.otpauth_url;
    const qrCode = await qrcode.toDataURL(otpauthUrl);

    return { qrCode, secret: secret.base32 };
  }

  // 🔹 **Verify 2FA**
  async verifyTwoFactorAuth(body: any) {
    const { userId, token } = body;

    const user = await this.usersService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('User not found.');
    }

    const isValid = speakeasy.totp.verify({
      secret: user.twoFactorSecret,
      encoding: 'base32',
      token,
    });

    if (!isValid) {
      throw new UnauthorizedException('Invalid two-factor authentication code.');
    }

    return { message: 'Two-factor authentication code is valid.' };
  }

  // 🔹 **Disable 2FA**
  async disableTwoFactorAuth(disableTwoFactorAuth: disableTwoFactorAuth) {
    const { userId } = disableTwoFactorAuth;

    const data = {
        id: userId,
        twoFactorSecret: null,
        isTwoFactorEnabled: false,
    }

    await this.usersService.updateUser(data);
    return { message: 'Two-factor authentication disabled.' };
  }

  // 🔹 **Refresh Token**
  async refreshToken(body: RefreshTokenDto) {
    const { token } = body;
    try {
      const decoded = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.usersService.findById(decoded.sub);
      if (!user) {
        throw new UnauthorizedException('Invalid refresh token.');
      }

      return this.generateJwtTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token.');
    }
  }

  async socialLogin(user: any) {
    if (!user) {
      throw new UnauthorizedException('Invalid OAuth login attempt.');
    }

    const payload = { sub: user.id, email: user.email };
    return {
      accessToken: this.jwtService.sign(payload),
      refreshToken: this.jwtService.sign(payload, { expiresIn: '7d' }),
      user,
    };
  }


  // 🔹 **Logout (Invalidate Tokens)**
  async logout() {
    return { message: 'Logged out successfully' };
  }
}