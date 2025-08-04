import dotenv from 'dotenv';

dotenv.config();

export const redisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || '',
  db: parseInt(process.env.REDIS_DB || '0'),
  
  // Connection options
  retryDelayOnFailover: 100,
  enableReadyCheck: false,
  maxRetriesPerRequest: 3,
  
  // Cache settings
  cache: {
    ttl: parseInt(process.env.REDIS_CACHE_TTL || '3600'), // 1 hour
    prefix: process.env.REDIS_CACHE_PREFIX || 'ultra_portal:'
  },
  
  // Session settings
  session: {
    ttl: parseInt(process.env.REDIS_SESSION_TTL || '86400'), // 24 hours
    prefix: process.env.REDIS_SESSION_PREFIX || 'session:'
  },
  
  // Queue settings
  queue: {
    prefix: process.env.REDIS_QUEUE_PREFIX || 'queue:',
    defaultJobOptions: {
      removeOnComplete: 100,
      removeOnFail: 50
    }
  },
  
  // Connect function
  async connect() {
    // For now, we'll use a simple in-memory store
    // In production, this would connect to Redis
    console.log('✅ Redis connection simulated (using in-memory store)');
  },
  
  // Disconnect function
  async disconnect() {
    console.log('✅ Redis disconnection simulated');
  }
}; 