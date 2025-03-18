import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-discord';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import { FindOrCreateUserDto } from '../../users/dto/users.dto';

@Injectable()
export class DiscordStrategy extends PassportStrategy(Strategy, 'discord') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('DISCORD_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('DISCORD_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('DISCORD_REDIRECT_URI') ?? '',
      scope: ['identify', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const { id, username, email } = profile;

      if (!email) {
        throw new UnauthorizedException('Discord account does not have a valid email.');
      }

      // 🔹 Use `findOrCreate` to simplify lookup & user creation
      const user = await this.usersService.findOrCreate({
        email,
        name: username,
        discordId: id,
      } as FindOrCreateUserDto);

      // 🔹 Generate JWT tokens for authentication
      const tokens = this.authService.generateJwtTokens(user);

      return done(null, { user, tokens });
    } catch (error) {
      console.error('Discord OAuth Error:', error);

      if (error instanceof UnauthorizedException) {
        return done(new UnauthorizedException(error.message), false);
      }

      return done(new InternalServerErrorException('An error occurred during Discord authentication'), false);
    }
  }
}