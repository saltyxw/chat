import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class RedisService {
    private redis: Redis;

    constructor() {
        this.redis = new Redis({
            host: 'localhost',
            port: 6379,
        });
    }

    async setUserOnline(userId: number): Promise<void> {
        await this.redis.set(`user:${userId}:online`, 'true', 'EX', 300);
        await this.redis.sadd('online:users', userId.toString());
    }

    async setUserOffline(userId: number): Promise<void> {
        await this.redis.del(`user:${userId}:online`);
        await this.redis.srem('online:users', userId.toString());
    }

    async isUserOnline(userId: number): Promise<boolean> {
        const result = await this.redis.get(`user:${userId}:online`);
        return result === 'true';
    }

    async getOnlineUsers(): Promise<number[]> {
        const users = await this.redis.smembers('online:users');
        return users.map(id => parseInt(id)).filter(id => !isNaN(id));
    }

    async refreshUserOnline(userId: number): Promise<void> {
        const isOnline = await this.isUserOnline(userId);
        if (isOnline) {
            await this.redis.expire(`user:${userId}:online`, 300);
        }
    }

}