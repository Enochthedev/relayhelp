import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-microsoft';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { FindOrCreateUserDto } from '../../users/dto/users.dto';

@Injectable()
export class MicrosoftStrategy extends PassportStrategy(Strategy, 'microsoft') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('MICROSOFT_CLIENT_ID') ?? '' ,
      clientSecret: configService.get<string>('MICROSOFT_CLIENT_SECRET')  ?? '',
      callbackURL: configService.get<string>('MICROSOFT_REDIRECT_URI') ?? '',
      scope: ['user.read'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const { id, displayName, emails } = profile;
      const email = emails?.[0]?.value;

      if (!email) {
        throw new UnauthorizedException('Microsoft account does not have a valid email.');
      }

      // 🔹 Use `findOrCreate` to simplify lookup & user creation
      const user = await this.usersService.findOrCreate({
        email,
        name: displayName,
        microsoftId: id,
      } as FindOrCreateUserDto);

      // 🔹 Generate JWT tokens for authentication
      const tokens = this.authService.generateJwtTokens(user);

      return done(null, { user, tokens });
    } catch (error) {
      console.error('Microsoft OAuth Error:', error);

      if (error instanceof UnauthorizedException) {
        return done(new UnauthorizedException(error.message), false);
      }

      return done(new InternalServerErrorException('An error occurred during Microsoft authentication'), false);
    }
  }
}