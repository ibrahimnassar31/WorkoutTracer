import { Redis } from 'ioredis';
import config from './index.ts'; 
import logger from '../utils/logger.ts'; 

let redisClient: Redis;

const connectRedis = async (): Promise<void> => {
  const redisUri = config.redisUri;

  if (!redisUri) {
    logger.error('Redis URI is not defined in configuration.');
    process.exit(1);
    return; 
  }

  try {
    redisClient = new Redis(redisUri);

    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('ready', () => {
      logger.info('Redis client is ready');
    });

    redisClient.on('error', (err: Error) => {
      logger.error('Redis client error:', err);

    });

    redisClient.on('end', () => {
        logger.info('Redis client connection ended');
    });

      await redisClient.ping();
      logger.info('Redis ping successful');

  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    process.exit(1);
  }
};

const getRedisClient = (): Redis => {
    if (!redisClient) {
        logger.error('Redis client not initialized. Call connectRedis first.');
        throw new Error('Redis client not initialized');
    }
    return redisClient;
};

const disconnectRedis = async (): Promise<void> => {
  try {
    await redisClient.quit();
    logger.info('Redis connection closed');
  } catch (error) {
    logger.error('Error closing Redis connection:', error);
  }
};

const setCache = async (key: string, value: unknown, expirySeconds?: number): Promise<void> => {
  const client = getRedisClient();
  const serializedValue = JSON.stringify(value);
  if (expirySeconds) {
    await client.setex(key, expirySeconds, serializedValue);
  } else {
    await client.set(key, serializedValue);
  }
};

const getCache = async (key: string): Promise<unknown> => {
  const client = getRedisClient();
  const data = await client.get(key);
  return data ? JSON.parse(data) : null;
};

export { connectRedis, getRedisClient, disconnectRedis , setCache, getCache };

