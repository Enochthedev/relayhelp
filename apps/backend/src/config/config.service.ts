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
}