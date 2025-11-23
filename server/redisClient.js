require('dotenv').config();
const Redis = require('ioredis');

if (!process.env.REDIS_URL) {
  console.error('💀 REDIS_URL not defined in environment variables');
  process.exit(1);
}

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('🧱 Connected to Redis');
});

redis.on('error', (err) => {
  console.error('💀 Redis connection error:', err);
});

module.exports = redis;