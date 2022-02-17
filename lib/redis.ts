import Redis from "ioredis";

let cachedRedis: Redis.Redis;

export default function redisConnect() {
  if (cachedRedis) return cachedRedis;

  const redis = new Redis(process.env.REDIS_ENDPOINT, {
    password: process.env.REDIS_PASSWORD,
  });
  cachedRedis = redis;
  return redis;
}
