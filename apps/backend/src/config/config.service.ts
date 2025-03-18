import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class ConfigService {
  get(key: string): string {
    return process.env[key] || '';
  }

  getPort(): number {
    return Number(this.get('PORT')) || 3000;
  }

  getDatabaseUrl(): string {
    return this.get('DATABASE_URL');
  }

  getRedisHost(): string {
    return this.get('REDIS_HOST');
  }

  getRedisPort(): number {
    return Number(this.get('REDIS_PORT')) || 6379;
  }

  getRabbitmqUrl(): string {
    return this.get('RABBITMQ_URL');
  }

  getJwtSecret(): string {
    return this.get('JWT_SECRET');
  }

  getJwtExpiresIn(): string {
    return this.get('JWT_EXPIRES_IN');
  }

  getDiscordBotToken(): string {
    return this.get('DISCORD_BOT_TOKEN');
  }

  getDiscordGuildId(): string {
    return this.get('DISCORD_GUILD_ID');
  }

  getDiscordTicketChannelId(): string {
    return this.get('DISCORD_TICKET_CHANNEL_ID');
  }

  getGoogleClientId(): string {
    return this.get('GOOGLE_CLIENT_ID');
  }

  getGoogleClientSecret(): string {
        return this.get('GOOGLE_CLIENT_SECRET');
  }

  getGoogleRedirectUri(): string {
        return this.get('GOOGLE_REDIRECT_URI');
  }

  getGithubClientId(): string {
    return this.get('GITHUB_CLIENT_ID');
  }

  getGithubClientSecret(): string {
        return this.get('GITHUB_CLIENT_SECRET');
  }

  getGithubRedirectUri(): string {
            return this.get('GITHUB_REDIRECT_URI');
  }

  getAppleClientId(): string {
    return this.get('APPLE_CLIENT_ID');
  }

  getAppleTeamId(): string {
    return this.get('APPLE_TEAM_ID');
  }

  getAppleKeyId(): string {
    return this.get('APPLE_KEY_ID');
  }

  getAppleKeyPath(): string {
    return this.get('APPLE_KEY_PATH');
  }

  getAppleRedirectUri(): string {
    return this.get('APPLE_REDIRECT_URI');
  }




}