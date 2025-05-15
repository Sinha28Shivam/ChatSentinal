import jwt from 'jsonwebtoken';
import {getRedisClient} from '../redisClient/redisClient.js';

export const generateToken = async(userId, res) =>{
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn: '7d'
    });

    const RedisClient = await getRedisClient();
    // cache the token in redis
    await RedisClient.sAdd(`tokens:${userId}`, token);
    await RedisClient.set(`token:${userId}`, token, {
        EX: 3600, // 1 hour
    })

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, //ms
        httpOnly: true, // prevent xss attack
        sameSite: "strict", // csrf attack
        secure: process.env.NODE_ENV !== 'development'
    })
    return token;
} 