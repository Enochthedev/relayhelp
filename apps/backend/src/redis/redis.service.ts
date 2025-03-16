import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { ConfigService } from '../config/config.service';

@Injectable()
export class RedisService {
  private client: Redis;

  constructor(private readonly configService: ConfigService) {
    this.client = new Redis({
      host: configService.getRedisHost(),
      port: configService.getRedisPort(),
    });
  }

  async set(key: string, value: string) {
    await this.client.set(key, value);
  }

  async get(key: string) {
    return await this.client.get(key);
  }
}