// import { Redis } from '@upstash/redis'

// export const redis = new Redis({
//   url: process.env.REDIS_URL!,
//   token: process.env.REDIS_SECRET!,
// })

import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL,
  password: process.env.REDIS_SECRET
});

redis.on('error', (err) => console.log('Redis Client Error', err));

(async () => {
  await redis.connect();
  console.log("Redis Client connected!");
})();
