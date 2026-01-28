import { createClient, RedisClientType } from 'redis';
import { env } from 'process';

let redisClient: RedisClientType;

export const connectRedis = async (): Promise<void> => {
  try {
    redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379',
    });

    redisClient.on('error', (err) => {
      console.error('Redis Client Error:', err);
    });

    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (error) {
    console.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

export const getRedisClient = (): RedisClientType => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

// Cache utility functions
export const cacheGet = async (key: string): Promise<string | null> => {
  try {
    const client = getRedisClient();
    return await client.get(key);
  } catch (error) {
    console.error('Redis GET error:', error);
    return null;
  }
};

export const cacheSet = async (key: string, value: string, expirationSeconds?: number): Promise<void> => {
  try {
    const client = getRedisClient();
    if (expirationSeconds) {
      await client.setEx(key, expirationSeconds, value);
    } else {
      await client.set(key, value);
    }
  } catch (error) {
    console.error('Redis SET error:', error);
  }
};

export const cacheDelete = async (key: string): Promise<void> => {
  try {
    const client = getRedisClient();
    await client.del(key);
  } catch (error) {
    console.error('Redis DELETE error:', error);
  }
};

export const cacheInvalidatePattern = async (pattern: string): Promise<void> => {
  try {
    const client = getRedisClient();
    const keys = await client.keys(pattern);
    if (keys.length > 0) {
      await client.del(keys);
    }
  } catch (error) {
    console.error('Redis invalidate pattern error:', error);
  }
};