// src/redisClient.js
import { createClient } from 'redis';

let client;

export const getRedisClient = async () => {
    if (!client) {
        const  redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
        client = createClient({ url: redisUrl });
        client.on('error', (err) => console.error('Redis Client Error:', err));
        await client.connect();
        console.log('🔌 Redis connected successfully');
}
return client;
}