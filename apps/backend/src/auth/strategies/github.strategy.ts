import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-github2';
import { Injectable, UnauthorizedException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../../users/users.service';
import { AuthService } from '../auth.service';
import axios from 'axios';
import { FindOrCreateUserDto } from '../../users/dto/users.dto';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      clientID: configService.get<string>('GITHUB_CLIENT_ID') ?? '',
      clientSecret: configService.get<string>('GITHUB_CLIENT_SECRET') ?? '',
      callbackURL: configService.get<string>('GITHUB_REDIRECT_URI') ?? '',
      scope: ['user:email'],
    });
  }


  async validate(accessToken: string, refreshToken: string, profile: any, done: Function) {
    try {
      const { id, username } = profile;
      let email = profile.emails?.[0]?.value;
  
      // If email is not available in the profile, fetch it using the access token
      if (!email) {
        const emailsResponse = await axios.get('https://api.github.com/user/emails', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const primaryEmailObj = emailsResponse.data.find((e: any) => e.primary && e.verified);
        email = primaryEmailObj ? primaryEmailObj.email : null;
      }
  
      if (!email) {
        throw new UnauthorizedException('GitHub account does not have a verified email.');
      }
  
      const user = await this.usersService.findOrCreate({
        email,
        name: username,
        githubId: id,
      } as FindOrCreateUserDto);
  
      const tokens = this.authService.generateJwtTokens(user);
  
      return done(null, { user, tokens });
    } catch (error) {
      console.error('GitHub OAuth Error:', error);
  
      if (error instanceof UnauthorizedException) {
        return done(error, false);
      }
  
      return done(new InternalServerErrorException('An error occurred during GitHub authentication'), false);
    }
  }
}