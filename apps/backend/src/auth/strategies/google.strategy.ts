import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { FindOrCreateUserDto } from '../../users/dto/users.dto';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GOOGLE_REDIRECT_URI') ?? '',
      scope: ['email', 'profile'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    try {
      const { id, emails, displayName } = profile;
      const email = emails?.[0]?.value;

      if (!email) {
        throw new UnauthorizedException('Google account does not have a valid email.');
      }

      // 🔹 Use `findOrCreate` to simplify lookup & user creation
      const user = await this.usersService.findOrCreate({
        email,
        name: displayName,
        googleId: id,
      } as FindOrCreateUserDto);

      // 🔹 Generate JWT tokens for authentication
      const tokens = this.authService.generateJwtTokens(user);

      return done(null, { user, tokens });
    } catch (error) {
      console.error('Google OAuth Error:', error);

      if (error instanceof UnauthorizedException) {
        return done(new UnauthorizedException(error.message), false);
      }

      return done(new InternalServerErrorException('An error occurred during Google authentication'), false);
    }
  }
}